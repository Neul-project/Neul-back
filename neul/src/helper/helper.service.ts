import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from 'entities/alert';
import { Helper } from 'entities/helpers';
import { Users } from 'entities/users';
import { HelperSignupDto } from 'src/helper/dto/req/helper-signup.dto';
import { In, Repository } from 'typeorm';

@Injectable()
export class HelperService {
    constructor(
        @InjectRepository(Helper)
        private helperRepository: Repository<Helper>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Alert)
        private alertRepository: Repository<Alert>
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
            profileImage: files.profileImage?.[0].originalname ?? '',
            certificate: files.certificate?.[0].originalname ?? '',
        });
        await this.helperRepository.save(helper);

        return {ok: true};
    }

    // 승인대기 도우미 전체 전달
    async helperApply(){
        const helpers = await this.helperRepository.find({ 
            where: {status: '승인 대기'}, 
            relations: ['user'],
        });

        return helpers;
    }

    // 승인완료 도우미 전체 전달
    async helperApprove(){
        const helpers = await this.helperRepository.find({ 
            where: {status: '승인 완료'}, 
            relations: ['user'],
        });

        return helpers;
    }

    // 해당 도우미 데이터 전달
    async helperOne(userId: number){
        const helper = await this.helperRepository.findOne({
            where: {user: {id: userId}},
            relations: ['user'],
        });

        return helper;
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
        await this.helperRepository.save(helper); // 승인 완료 상태

        const alert = this.alertRepository.create({
            user: helper.user,
            message: 'helper',
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
        await this.helperRepository.save(helper); // 승인 반려 상태

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
