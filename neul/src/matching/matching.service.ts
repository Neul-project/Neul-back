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
        private applyRepository: Repository<Apply>
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

    // // 피보호자-관리자 매칭 + 채팅방 생성 + 알림 추가
    // async userMatch(adminId: number, userId: number, patientId: number){
    //     const admin = await this.userRepository.findOne({where:{ id: adminId }});
    //     const user = await this.userRepository.findOne({where: { id: userId }});
    //     const patient = await this.patientRepository.findOne({where: { id: patientId }});
        
    //     if (!admin || !user || !patient){
    //         throw new NotFoundException('해당 관리자/보호자/피보호자 계정을 찾을 수 없습니다.');
    //     }

    //     const existingMatch = await this.matchRepository.findOne({
    //         where: { admin: { id: adminId }, user: { id: userId } }
    //     });

    //     if (!existingMatch) { // 보호자와 관리자 매칭
    //         const match = this.matchRepository.create({ user, admin });
    //         await this.matchRepository.save(match);
    //     }

    //     patient.admin = admin;
    //     await this.patientRepository.save(patient); // 피보호자와 관리자 매칭

    //     const existingRoom = await this.chatRoomRepository.findOne({
    //         where: {
    //             user: { id: userId },
    //             admin: { id: adminId },
    //         },
    //     });

    //     if (!existingRoom) { // 채팅방 생성
    //         const newRoom = this.chatRoomRepository.create({
    //             user: user,
    //             admin: admin,
    //         });
    //         await this.chatRoomRepository.save(newRoom);
    //     };

    //     const alert = this.alertRepository.create({ // 알림 추가
    //         user: user,
    //         admin: admin,
    //         message: 'match'
    //     });
    //     await this.alertRepository.save(alert);

    //     return { ok: true };
    // }

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
}
