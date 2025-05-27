import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from 'entities/alert';
import { Helper } from 'entities/helpers';
import { Shift } from 'entities/shift';
import { Users } from 'entities/users';
import { HelperSignupDto } from 'src/helper/dto/req/helper-signup.dto';
import { In, IsNull, Not, Repository } from 'typeorm';
import { HelperPossibleDto } from './dto/req/helper-possible.dto';
import { HelperUpdateDto } from './dto/req/helper-update.dto';
import { HelperQueryDto } from './dto/req/helper-query.dto';

@Injectable()
export class HelperService {
    constructor(
        @InjectRepository(Helper)
        private helperRepository: Repository<Helper>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Alert)
        private alertRepository: Repository<Alert>,
        @InjectRepository(Shift)
        private shiftRepository: Repository<Shift>
    ) {}

    // 도우미 프로필 정보 저장
    async helperSign(dto: HelperSignupDto, files: {profileImage: Express.Multer.File[]; certificate: Express.Multer.File[]}){
        const user = await this.userRepository.findOne({ where: {id: Number(dto.userId)}});
        if(!user){
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        const helper = this.helperRepository.create({
            user,
            desiredPay: Number(dto.desiredPay),
            experience: dto.experience,
            birth: dto.birth,
            gender: dto.gender,
            certificateName: dto.certificateName_01,
            certificateName2: dto.certificateName_02,
            certificateName3: dto.certificateName_03,
            profileImage: files.profileImage?.[0].filename ?? '',
            certificate: files.certificate?.[0].filename ?? '',
        });
        await this.helperRepository.save(helper);
        return {ok: true};
    }

    // 도우미 프로필 정보 수정
    async helperUpdate(dto: HelperUpdateDto, files: {profileImage: Express.Multer.File[]; certificate: Express.Multer.File[]}){
        const helper = await this.helperRepository.findOne({ where: {user: {id: Number(dto.userId)}}})
        if(!helper){
            throw new Error('도우미 정보를 찾을 수 없습니다.')
        }

        if(dto.type === 'reject'){ // 도우미 반려되었을 경우에만
            helper.status = '승인 대기'
        }
        
        helper.desiredPay = Number(dto.desiredPay);
        helper.experience = dto.experience;
        helper.certificateName = dto.certificateName_01;
        helper.certificateName2 = dto.certificateName_02;
        helper.certificateName3 = dto.certificateName_03;

        if (files.profileImage?.[0]) {
            helper.profileImage = files.profileImage[0].filename;
        }
        if (files.certificate?.[0]) {
            helper.certificate = files.certificate[0].filename;
        }

        await this.helperRepository.save(helper);

        return {ok: true};
    }

    // 도우미 가능 날짜 저장
    async helperPossible(userId: number, dto: HelperPossibleDto){
        const user = await this.userRepository.findOne({ where: {id: userId} });
        if(!user){
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        const shift = this.shiftRepository.create({
            admin: user,
            startDate: dto.startDate,
            endDate: dto.endDate,
            week: dto.week.join(','),
        });
        
        return await this.shiftRepository.save(shift);
    }

    // 도우미 가능 날짜 수정
    async helperPossibleUpdate(userId: number, dto: HelperPossibleDto){
        const shift = await this.shiftRepository.findOne({ where: {admin: {id: userId}} })
        if (!shift) {
            throw new NotFoundException('도우미 가능 날짜 정보가 존재하지 않습니다.');
        }
        shift.startDate = dto.startDate;
        shift.endDate = dto.endDate;
        shift.week = dto.week.join(',');

        return await this.shiftRepository.save(shift);
    }

    // 도우미 가능 날짜 전달
    async getHelperPossible(helperId: number){
        const shift = await this.shiftRepository.findOne({ 
            where: {admin: {id: helperId}},
            relations: ['admin'],
        });

        if(!shift) return;
        
        return {
            startDate: shift.startDate,
            endDate: shift.endDate,
            week: shift.week
        };
    }

    // 도우미 전체 전달
    async helperAll(query: HelperQueryDto){
        const { type, search, search_value } = query;

        let statusCondition: string | undefined;
        if (type === 'wait') statusCondition = '승인 대기';
        else if (type === 'approve') statusCondition = '승인 완료';
        else if (type === 'reject') statusCondition = '승인 반려';

        const queryBuilder = this.helperRepository
            .createQueryBuilder('helper')
            .leftJoinAndSelect('helper.user', 'admin')
            .leftJoinAndSelect('admin.applyRequests', 'apply')

        if(statusCondition){ // 도우미 승인 상태 조건 
            queryBuilder.andWhere('helper.status = :status', { status: statusCondition });
        }

        if(search && search_value === 'id'){ // 도우미 id 검색
            queryBuilder.andWhere('CAST(admin.id AS CHAR) LIKE :search', { search: `%${search}%` })
        }
        else if(search && search_value === 'name'){ // 도우미 이름 검색
            queryBuilder.andWhere('admin.name LIKE :search', { search: `%${search}%` });
        }

        const helpers = await queryBuilder.getMany();
        return helpers.map(helper => {
            return {
                ...helper,
                admin: {
                    dates: helper.user.applyRequests?.map(apply => apply.dates) || []
                }
            };
        });
    }

    // 해당 도우미 데이터 전달
    async helperOne(userId: number){
        const helper = await this.helperRepository.findOne({
            where: {user: {id: userId}},
            relations: ['user'],
        });

        let reason;

        if(helper.status === '승인 반려'){
            const alert = await this.alertRepository.findOne({
                where: { 
                    user: {id: userId},
                    message: 'helper_cancel',
                    reason: Not(IsNull())
                },
                order: {created_at: 'DESC'} // 최신알림 1개만
            });

            if(alert.reason){
                reason = alert.reason;
            }
        }

        return { ...helper, reason };
    }

    // 정식 도우미 승인 + 알림 추가
    async helperYes(userId: number){
        const helper = await this.helperRepository.findOne({
            where: {user: {id: userId}},
            relations: ['user'],
        });

        if(!helper){
            throw new Error('해당 정보가 없습니다.')
        }

        helper.status = '승인 완료';
        await this.helperRepository.save(helper); // 승인 완료 상태 변경

        const alert = this.alertRepository.create({
            user: helper.user,
            message: 'helper_ok',
        });
        return await this.alertRepository.save(alert); // 알림 추가
    }

    // 정식 도우미 승인 반려 + 알림 추가
    async helperNo(userId: number, reason: string){
        const helper = await this.helperRepository.findOne({
            where: {user: {id: userId}},
            relations: ['user'],
        });

        if(!helper){
            throw new Error('해당 정보가 없습니다.')
        }

        helper.status = '승인 반려';
        await this.helperRepository.save(helper); // 승인 반려 상태 변경

        const alert = this.alertRepository.create({
            user: helper.user,
            message: 'helper_cancel',
            reason
        });
        return await this.alertRepository.save(alert); // 알림 추가
    }

    // 도우미 삭제
    async helperDel(userIds: number[]){
        if (!userIds || userIds.length === 0) {
            throw new Error('삭제할 유저 ID가 없습니다.');
        }

        return await this.userRepository.delete({id: In(userIds)});
    }
}
