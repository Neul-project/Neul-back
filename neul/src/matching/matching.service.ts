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

    // 담당 유저 전달
    async userSelect(userId: number){
        const patients = await this.patientRepository.find({
            where: {admin: {id: userId}},
            relations: ['user', 'admin']
        });

        const applys = await this.applyRepository.find({
            where: {admin: {id: userId}},
            relations: ['user']
        });

        return patients.map(p => {
            const result = applys.filter(a => a.user.id === p.user.id);

            // 한 명의 보호자가 같은 담당자한테 여러번 신청할 경우 고려
            // 결과 예시 2025-05-26,2025-05-27/2025-06-01
            const dates = result.map(r => r.dates).join('/') || null;

            return {
                user_id: p.user?.id || null,
                user_name: p.user?.name || null,
                user_email: p.user?.email || null,
                user_phone: p.user?.phone || null,
                user_create: p.user?.created_at || null,

                admin_id: p.admin?.id || null,
                admin_name: p.admin?.name || null,

                patient_id: p.id,
                patient_name: p.name || '없음',
                patient_gender: p.gender || '없음',
                patient_birth: p.birth || '없음',
                patient_note: p.note || '없음',

                dates
            }
        });
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

        return {ok: true};
    }

    // 도우미 매칭 수락 + 알림 추가
    async helperAccept(adminId: number, userId: number){
        const user = await this.userRepository.findOne({where: {id: userId}});
        const admin = await this.userRepository.findOne({where: {id: adminId}});
        const apply = await this.applyRepository.findOne({
            where: { admin: {id: adminId}, user: {id: userId}}
        });

        if(!admin || !user){
            throw new Error('해당 도우미/유저를 찾을 수 없습니다.');
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
    async helperCancel(adminId: number, userId: number, reason: string){
        const user = await this.userRepository.findOne({where: {id: userId}});
        const admin = await this.userRepository.findOne({where: {id: adminId}});
        const apply = await this.applyRepository.findOne({
            where: { admin: {id: adminId}, user: {id: userId}}
        });

        if(!admin || !user){
            throw new Error('해당 도우미/유저가 없습니다.');
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

    // // 피보호자-관리자 매칭 취소 + 사용자쪽 채팅 내역 삭제 + 알림 추가
    // async userNotMatch(adminId: number, userId: number, patientId: number){
    //     const admin = await this.userRepository.findOne({where:{ id: adminId }});
    //     const user = await this.userRepository.findOne({where: { id: userId }});
    //     const patient = await this.patientRepository.findOne({where: { id: patientId }});
        
    //     if (!admin || !user || !patient){
    //         throw new NotFoundException('해당 관리자/보호자/피보호자 계정을 찾을 수 없습니다.');
    //     }

    //     patient.admin = null;
    //     await this.patientRepository.save(patient); // 매칭 해제

    //     const match = await this.matchRepository.findOne({
    //         where: { admin: { id: adminId }, user: { id: userId } }
    //     });
        
    //     if(match){
    //         await this.matchRepository.remove(match); // 매칭 해제
    //     }

    //     const room = await this.chatRoomRepository.findOne({
    //         where: {
    //             user: {id: userId},
    //             admin: {id: adminId}
    //         },
    //         relations: ['chats'],
    //     });

    //     if (room){ // userDel을 true로 변경
    //         const chats = room.chats.map(chat => {
    //             chat.userDel = true;
    //             return chat;
    //         });
    //         await this.chatRepository.save(chats);
    //     };

    //     const alert = this.alertRepository.create({ // 알림 추가
    //         user: user,
    //         admin: admin,
    //         message: 'match_cancel'
    //     });
    //     await this.alertRepository.save(alert);

    //     return { ok: true };
    // }

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

    // 해당 도우미에게 매칭 신청한 유저 전달
    async applyUser(adminId: number){
        const users = await this.applyRepository.find({
            where: {admin: {id: adminId}},
            relations: ['user', 'user.familyPatients'],
        });

        return users.map((apply) =>{
            const patient = apply.user.familyPatients?.[0];

            return{
                status: apply.status,
                created_at: apply.created_at,

                id: apply.user.id,
                email: apply.user.email,
                name: apply.user.name,
                phone: apply.user.phone,
                dates: apply.dates,

                patient_id: patient.id,
                patient_name: patient.name || '없음',
                patient_gender: patient.gender || '없음',
                patient_birth: patient.birth || '없음',
                patient_note: patient.note || '없음',
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
