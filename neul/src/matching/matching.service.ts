import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'entities/chat_room';
import { Patients } from 'entities/patients';
import { Users } from 'entities/users';
import { Repository } from 'typeorm';

@Injectable()
export class MatchingService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Patients)
        private patientRepository: Repository<Patients>,
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>
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

    // 피보호자-관리자 매칭 + 채팅방 생성
    async userMatch(adminId: number, userId: number, patientId: number){
        const admin = await this.userRepository.findOne({where:{ id: adminId }});
        if (!admin){
            throw new NotFoundException('해당 관리자 계정을 찾을 수 없습니다.');
        }

        const user = await this.userRepository.findOne({where: { id: userId }});
        if (!user) {
            throw new NotFoundException('해당 보호자 계정을 찾을 수 없습니다.');
        }

        const patient = await this.patientRepository.findOne({where: { id: patientId }});
        if (!patient){ 
            throw new NotFoundException('해당 피보호자를 찾을 수 없습니다.');
        }

        patient.admin = admin;
        await this.patientRepository.save(patient); // 피보호자와 관리자 매칭

        const existingRoom = await this.chatRoomRepository.findOne({
            where: {
                user: { id: userId },
                admin: { id: adminId },
            },
        });

        if (!existingRoom) { // 채팅방 생성
            const newRoom = this.chatRoomRepository.create({
                user: user,
                admin: admin,
            });
            await this.chatRoomRepository.save(newRoom);
        };

        return { ok: true };
    }
}
