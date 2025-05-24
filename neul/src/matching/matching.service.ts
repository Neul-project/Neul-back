import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from 'entities/alert';
import { ChatRoom } from 'entities/chat_room';
import { Chats } from 'entities/chats';
import { Patients } from 'entities/patients';
import { Users } from 'entities/users';
import { Like, Raw, Repository } from 'typeorm';
import { SearchUserDto } from './dto/req/search-user.dto';
import { Match } from 'entities/match';
import { Helper } from 'entities/helpers';
import { Apply } from 'entities/apply';
import { MatchSubmitDto } from './dto/req/match-submit.dto';
import { MatchPayDto } from './dto/req/match-pay.dto';
import { Charge } from 'entities/charge';
import { MatchPayOKDto } from './dto/req/match-pay-ok.dto';

@Injectable()
export class MatchingService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Patients)
        private patientRepository: Repository<Patients>,
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>,
        @InjectRepository(Alert)
        private alertRepository: Repository<Alert>,
        @InjectRepository(Chats)
        private chatRepository: Repository<Chats>,
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
        @InjectRepository(Helper)
        private helperRepository: Repository<Helper>,
        @InjectRepository(Apply)
        private applyRepository: Repository<Apply>,
        @InjectRepository(Charge)
        private chargeRepository: Repository<Charge>
    ) {}

    // 전체 유저 전달
    async userAll(){
        const patients = await this.patientRepository.find({
            relations: ['user', 'admin']
        });

        return patients.map(x => ({
            user_id: x.user?.id || null,
            user_name: x.user?.name || null,
            user_email: x.user?.email || null,
            user_phone: x.user?.phone || null,
            user_create: x.user?.created_at || null,

            admin_id: x.admin?.id || null,
            admin_name: x.admin?.name || null,

            patient_id: x.id,
            patient_name: x.name || '없음',
            patient_gender: x.gender || '없음',
            patient_birth: x.birth || '없음',
            patient_note: x.note || '없음'
        }));
    }

    // 선택 유저 삭제
    async userDel(ids: number[]){
        return await this.userRepository.delete(ids);
    }

    // 선택한 도우미 리스트 전달
    async myHelperList(userId: number){
        const helpers = await this.helperRepository.find({ 
            where: {status: '승인 완료'}, 
            relations: ['user'],
        });

        const applys = await this.applyRepository.find({
            where: {user: {id: userId}},
            relations: ['admin']
        })

        return helpers.map(helper => {
            const matchedOK = applys.find(
                apply => apply.admin.id === helper.user.id // 유저가 선택한 도우미일 경우만
            );

            if(!matchedOK) return;

            return {...helper, apply_status: matchedOK.status, apply_dates: matchedOK.dates};
        })
    }

    // 사용자 매칭 신청 + 알림 추가
    async submitReq(userId: number, dto: MatchSubmitDto){
        const user = await this.userRepository.findOne({where: {id: userId}});
        const admin = await this.userRepository.findOne({where: {id: dto.helperId}});
        if(!admin || !user){
            throw new Error('해당 도우미/유저를 찾을 수 없습니다.');
        }

        const apply = this.applyRepository.create({
            user,
            admin,
            dates: dto.dates.join(',')
        });
        await this.applyRepository.save(apply); // 매칭 신청

        const alert = this.alertRepository.create({
            user,
            admin,
            message: 'match_apply'
        });
        await this.alertRepository.save(alert); // 알림 추가

        return {ok: true, confirmedDates: apply.dates};
    }

    // 도우미 매칭 수락 + 알림 추가
    async helperAccept(applyId: number, adminId: number, userId: number){
        const user = await this.userRepository.findOne({where: {id: userId}});
        const admin = await this.userRepository.findOne({where: {id: adminId}});
        const apply = await this.applyRepository.findOne({where: {id: applyId}});

        if(!admin || !user || !apply){
            throw new Error('해당 정보를 찾을 수 없습니다.');
        }

        apply.status = '결제 대기';
        await this.applyRepository.save(apply); // 결제 대기 상태 변경

        const alert = this.alertRepository.create({
            user,
            admin,
            message: 'match_ok'
        });
        return await this.alertRepository.save(alert); // 알림 추가
    }

    // 도우미 매칭 거절 + 알림 추가
    async helperCancel(applyId: number, adminId: number, userId: number, reason: string){
        const user = await this.userRepository.findOne({where: {id: userId}});
        const admin = await this.userRepository.findOne({where: {id: adminId}});
        const apply = await this.applyRepository.findOne({where: {id: applyId}});

        if(!admin || !user || !apply){
            throw new Error('해당 정보를 찾을 수 없습니다.');
        }

        apply.status = '승인 반려';
        await this.applyRepository.save(apply); // 승인 반려 상태 변경

        const alert = this.alertRepository.create({
            user,
            admin,
            message: 'match_cancel',
            reason
        });
        return await this.alertRepository.save(alert); // 알림 추가
    }

    // 사용자 매칭 결제 요청
    async helperMatch(userId: number, dto: MatchPayDto){
        const user = await this.userRepository.findOne({where: {id: userId}});
        if(!user){
            throw new Error('해당 유저를 찾을 수 없습니다.');
        }

        const charge = this.chargeRepository.create({
            user,
            price: dto.amount,
            orderId: dto.orderId
        })
        return await this.chargeRepository.save(charge); // 매칭 결제 테이블 저장
    }
    
    // 사용자 매칭 결제 완료 + 매칭테이블 추가 + 채팅방 생성 + 알림 추가
    async helperMatchOK(userId: number, dto: MatchPayOKDto){
        const user = await this.userRepository.findOne({where: {id: userId}});
        const admin = await this.userRepository.findOne({where: {id: dto.helperId}});
        if(!admin || !user){
            throw new Error('해당 도우미/유저를 찾을 수 없습니다.');
        }

        const charge = await this.chargeRepository.findOne({
            where: {orderId: dto.orderId, user: {id: userId}}
        });
        charge.paymentKey = dto.paymentKey;
        await this.chargeRepository.save(charge); // paymentKey 저장

        const apply = await this.applyRepository.findOne({
            where: {admin: {id: dto.helperId}, user: {id: userId}}
        });
        apply.status = '결제 완료';
        await this.applyRepository.save(apply); // 결제 완료 상태 변경

        const match = this.matchRepository.create({user, admin});
        await this.matchRepository.save(match) // 보호자와 관리자 매칭 (매칭테이블 추가)

        const patient = await this.patientRepository.findOne({where: {user: {id: userId}}});
        patient.admin = admin;
        await this.patientRepository.save(patient); // 피보호자와 관리자 매칭 (피보호자 테이블 업데이트)

        const room = this.chatRoomRepository.create({user, admin});
        await this.chatRoomRepository.save(room); // 채팅방 생성

        const alert = this.alertRepository.create({
            user,
            admin,
            message: 'pay_match',
        });
        await this.alertRepository.save(alert); // 알림 추가

        return {ok: true};
    }

    // 사용자 매칭 끝1 (신청내역 전달)
    async getApplyAll(userId: number){
        return await this.applyRepository.find({where: {user: {id: userId}}});       
    }

    // 사용자 매칭 끝2 (매칭테이블 취소 + 알림 추가)
    async deleteMatch(applyId: number, userId: number, adminId: number){
        const user = await this.userRepository.findOne({ where: {id: userId} });
        const admin = await this.userRepository.findOne({ where: {id: userId} });
        const apply = await this.applyRepository.findOne({ where: {id: applyId} });
        
        if(!user || !admin || !apply) return;

        await this.applyRepository.remove(apply); // 신청 내역 삭제
        
        const match = await this.matchRepository.findOne({
            where: {user: {id: userId}, admin: {id: adminId}}
        });

        if(match){
            await this.matchRepository.remove(match); // 보호자와 관리자 매칭 취소 (매칭테이블 삭제)
        }

        const patient = await this.patientRepository.findOne({where: {user: {id: userId}}});
        patient.admin = null;
        await this.patientRepository.save(patient); // 피보호자와 관리자 매칭 취소 (피보호자 테이블 업데이트)

        const alert = this.alertRepository.create({
            user: user,
            admin: admin,
            message: 'match_end'
        });
        await this.alertRepository.save(alert); // 알림 추가

    }

    // 전체 회원 검색
    async getSerchUser(dto: SearchUserDto){
        let patients: Patients[] = [];

        if (dto.search === 'user_id' || dto.search === 'user_name') {
            const userWhere = dto.search === 'user_id'
                ? { id: Raw((alias) => `CAST(${alias} AS CHAR) LIKE '%${dto.word}%'`) }
                : { name: Like(`%${dto.word}%`) };

            const users = await this.userRepository.find({
                where: userWhere,
                relations: ['familyPatients']
            });

            // flatMap을 이용해 user와 연결된 환자들을 한 번에 정리
            patients = users.flatMap(user =>
                (user.familyPatients || []).map(patient => {
                    patient.user = user;
                    return patient;
                })
            );

        } else if (dto.search === 'patient_name') {
            patients = await this.patientRepository.find({
                where: { name: Like(`%${dto.word}%`) },
                relations: ['user', 'admin']
            });
        } else {
            throw new Error('지원하지 않는 검색 기준입니다.');
        }

        return patients.map(x => ({
            user_id: x.user?.id || null,
            user_name: x.user?.name || null,
            user_email: x.user?.email || null,
            user_phone: x.user?.phone || null,
            user_create: x.user?.created_at || null,

            admin_id: x.admin?.id || null,
            admin_name: x.admin?.name || null,

            patient_id: x.id,
            patient_name: x.name || '없음',
            patient_gender: x.gender || '없음',
            patient_birth: x.birth || '없음',
            patient_note: x.note || '없음'
        }));
    }

    // 담당 회원 검색
    async getSerchUserSelected(adminId: number, dto: SearchUserDto){
        const query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.familyPatients', 'patient')
            .leftJoin('patient.admin', 'admin')
            .leftJoinAndMapOne(
                'user.apply', Apply, 'apply',
                'apply.user.id = user.id AND apply.admin.id = :adminId', { adminId }
            )
            .leftJoinAndMapOne(
                'user.match', Match, 'match',
                'match.user.id = user.id AND match.admin.id = :adminId', { adminId }
            )
            .where('patient.admin.id = :adminId', { adminId });

        if(dto.search === 'user_id'){
            query.andWhere('user.id LIKE :word', {word: `%${dto.word}%`})
        }
        else if(dto.search === 'user_name'){
            query.andWhere('user.name LIKE :word', {word: `%${dto.word}%`});
        }
        else if(dto.search === 'patient_name'){
            query.andWhere('patient.name LIKE :word', {word: `%${dto.word}%`});
        }
        
        const result = await query.getMany();

        return result.map((user)=> {
            const patient = user.familyPatients?.[0];
            
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone
                },
                patient: patient ? {
                    id: patient.id,
                    name: patient.name,
                    gender: patient.gender,
                    birth: patient.birth,
                    note: patient.note,
                } : null,
                apply: {
                    dates: user['apply']?.dates || null
                },
                match: {
                    matching_at: user['match']?.matching_at || null
                },
            };
        });
    }

    // 해당 도우미에게 매칭 신청한 유저 전달
    async applyUser(adminId: number){
        const result = await this.applyRepository
            .createQueryBuilder('apply')
            .leftJoinAndSelect('apply.user', 'user')
            .leftJoinAndSelect('user.familyPatients', 'patient')
            .where('apply.admin.id = :adminId', { adminId })
            .andWhere('apply.status = :status', { status: '승인 대기' })
            .getMany();

        return result.map((apply) =>{
            const patient = apply.user.familyPatients?.[0];

            return{
                user: {
                    id: apply.user.id,
                    email: apply.user.email,
                    name: apply.user.name,
                    phone: apply.user.phone
                },
                patient: patient ? {
                    id: patient.id,
                    name: patient.name,
                    gender: patient.gender,
                    birth: patient.birth,
                    note: patient.note,
                } : null,
                apply: {
                    id: apply.id,
                    status: apply.status,
                    dates: apply.dates,
                    created_at: apply.created_at
                },
            };
        });
    }

    // 매칭된 일정 전달 (도우미)
    async helperSchedule(adminId: number){
        const applys = await this.applyRepository.find({
            where: {admin: {id: adminId}, status: '결제 완료'},
            relations: ['user', 'user.familyPatients']
        });

        return applys.map(apply =>{
            const user = apply.user;
            const patient = user.familyPatients?.[0]

            return {
                id: apply.id,
                userId: user.id,
                userName: user.name,
                phone: user.phone,
                patientId: patient.id,
                patientName: patient.name,
                availableDate: apply.dates,
            };
        })
    }
}
