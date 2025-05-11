import { Injectable, NotFoundException } from '@nestjs/common';
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
    async saveChat({userId, message, sender}){
        const user = await this.userRepository.findOne({ where: {id: userId} });
        
        // 해당 유저-관리자 채팅방
        let room = await this.chatRoomRepository.findOne({
            where: { user: {id: userId} },
            relations: ['admin'],
        });

        if (!room) {
            throw new Error('연결된 도우미가 없습니다.');
        }

        const chat = this.chatRepository.create({
            user,
            admin: room.admin,
            message,
            room,
            sender
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
                'COALESCE(MAX(chat.created_at), room.created_at) AS lastTime', // 마지막 채팅 보낸 시각
                `COALESCE(MAX(chat.message), '') AS lastMessage`, // 마지막으로 보낸 채팅 내용
                `COALESCE(SUM(CASE WHEN chat.read = false AND chat.adminId = :adminId THEN 1 ELSE 0 END), 0) AS unreadCount`, // 안 읽은 알림 개수
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

    // 읽음처리
    async chatRead(adminId: number, userId: number){
        const room = await this.chatRoomRepository.findOne({
            where: {
                admin: { id: adminId },
                user: { id: userId },
            },
        });

        if (!room) {
            throw new NotFoundException('해당 채팅방이 존재하지 않습니다.');
        }

        // 해당 채팅방의 'user'가 보낸 메시지 중 아직 읽지 않은 것들을 읽음 처리
        return await this.chatRepository
            .createQueryBuilder()
            .update()
            .set({ read: true })
            .where('roomId = :roomId', { roomId: room.id })
            .andWhere('sender = :sender', { sender: 'user' })
            .andWhere('read = false')
            .execute();
    }
}
