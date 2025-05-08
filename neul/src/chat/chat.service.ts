import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'entities/chat_room';
import { Chats } from 'entities/chats';
import { Users } from 'entities/users';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chats)
        private chatRepository: Repository<Chats>,
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>
    ) {}

    // 채팅 저장
    async saveChat({userId, adminId, message}){
        const user = await this.userRepository.findOne({ where: {id: userId} });
        const admin = await this.userRepository.findOne({ where: {id: adminId} });

        if (!user || !admin) {
            throw new Error('사용자가 존재하지 않습니다.');
        }

        // 해당 유저-관리자 채팅방
        let room = await this.chatRoomRepository.findOne({
            where: { user: {id: userId}, admin: {id: adminId} },
        });

        if (!room) {
            room = this.chatRoomRepository.create({ user, admin });
            room = await this.chatRoomRepository.save(room);
        }

        const chat = this.chatRepository.create({
            user,
            admin,
            message,
            room
        });
        return await this.chatRepository.save(chat);
    }

    // 채팅목록 전달 (사용자)
    async getChatList(userId: number){
        const chat = await this.chatRepository.find({
            where: {user: {id: userId}},
            order: {created_at: 'ASC'},
            relations: ['user', 'admin'],
        });
        
        return chat;
    }
    
    // 채팅방 전달 (관리자)
    async getChatroomList(adminId: number){
        const chatRoom = await this.chatRoomRepository
            .createQueryBuilder('room')
            .leftJoin('room.user', 'user') // 보호자
            .leftJoin('room.admin', 'admin') // 관리자
            .leftJoin('user.familyPatients', 'patient') // 보호자의 피보호자
            .leftJoin('room.chats', 'chat')
            .select([
                'room.id AS id', // 고유 id
                'user.id AS userId', // 보호자 id
                'user.name AS userName', // 관리자가 담당하고 있는 보호자 이름
                'patient.name AS patientName', // 해당 보호자의 피보호자 이름
                'MAX(chat.created_at) AS lastTime', // 마지막 채팅 보낸 시각
                'MAX(chat.message) AS lastMessage', // 마지막으로 보낸 채팅 내용
                `SUM(CASE WHEN chat.read = false AND chat.adminId = :adminId THEN 1 ELSE 0 END) AS unreadCount`, // 안 읽은 알림 개수
            ])
            .where('room.adminId = :adminId', { adminId })
            .groupBy('room.id')
            .addGroupBy('user.id')
            .addGroupBy('user.name')
            .addGroupBy('patient.name')
            .orderBy('lastTime', 'DESC')
            .getRawMany();

        return chatRoom.map((room) => ({
            ...room,
            unreadCount: parseInt(room.unreadCount, 10)
        }));
    }
}
