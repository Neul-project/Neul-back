import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'entities/chat_room';
import { Chats } from 'entities/chats';
import { Match } from 'entities/match';
import { Patients } from 'entities/patients';
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
        private userRepository: Repository<Users>,
        @InjectRepository(Patients)
        private patientRepository: Repository<Patients>,
        @InjectRepository(Match)
        private matchRepository: Repository<Match>
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

    // 채팅목록 전달 (사용자+관리자)
    async getChatList(userId: number, page: number, limit: number){
        const room = await this.chatRoomRepository.findOne({
            where:{ user: {id: userId} }
        });

        const chat = await this.chatRepository.find({
            where: { 
                room: {id: room.id}
            },
            order: {created_at: 'DESC'},
            take: limit,
            skip: (page-1) * limit,
            relations: ['user', 'admin'],
        });

        return chat.reverse();
    }
    
    // 채팅방 전달 (관리자)
    async getChatroomList(adminId: number){
        const latestChatSubquery = this.chatRepository
            .createQueryBuilder('chat')
            .select([
                'chat.roomId AS roomId',
                'chat.message AS lastMessage',
                'chat.created_at AS lastTime',
                'ROW_NUMBER() OVER (PARTITION BY chat.roomId ORDER BY chat.created_at DESC) AS sub',
            ]);

        const chatRoom = await this.chatRoomRepository
            .createQueryBuilder('room')
            .leftJoin('room.user', 'user') // 보호자
            .leftJoin('room.admin', 'admin') // 관리자
            .leftJoin('user.familyPatients', 'patient') // 보호자의 피보호자
            .leftJoin('room.chats', 'chat')
            .leftJoin('match', 'match', 'match.adminId = :adminId AND match.userId = user.id', { adminId })            .leftJoin(
                '(' + latestChatSubquery.getQuery() + ')',
                'latest',
                'latest.roomId = room.id AND latest.sub = 1'
            )
            .setParameters(latestChatSubquery.getParameters())
            .select([
                'room.id AS id', // 고유 id
                'user.id AS userId', // 보호자 id
                'user.name AS userName', // 관리자가 담당하고 있는 보호자 이름
                'patient.name AS patientName', // 해당 보호자의 피보호자 이름
                'COALESCE(latest.lastTime, room.created_at) AS lastTime', // 마지막 채팅 보낸 시각
                `COALESCE(latest.lastMessage, '') AS lastMessage`, // 마지막으로 보낸 채팅 내용
                `COALESCE(SUM(CASE 
                    WHEN chat.read = false AND chat.adminId = :adminId AND chat.sender = 'user' 
                    THEN 1 ELSE 0 END), 0) AS unreadCount`, // 안 읽은 알림 개수
                'CASE WHEN match.id IS NOT NULL THEN 1 ELSE 0 END AS isMatched'
            ])
            .where('room.adminId = :adminId', { adminId })
            .groupBy('room.id')
            .addGroupBy('user.id')
            .addGroupBy('user.name')
            .addGroupBy('patient.name')
            .addGroupBy('latest.lastTime')
            .addGroupBy('latest.lastMessage')
            .addGroupBy('match.id')
            .orderBy('lastTime', 'DESC')
            .getRawMany();
            
        return chatRoom.map((room) => ({
            ...room,
            unreadCount: parseInt(room.unreadCount, 10),
            isMatched: room.isMatched === true || room.isMatched === 1,
        }));
    }

    // 읽음처리 (관리자)
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

    // 읽음처리 (사용자)
    async chatReadUser(adminId: number, userId: number){
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
            .andWhere('sender = :sender', { sender: 'admin' })
            .andWhere('read = false')
            .execute();

    }

    // 채팅내역 삭제 (사용자)
    async chatDel(userId: number){
        return await this.chatRepository.update(
            { user: { id: userId } },
            { userDel: true },
        );
    }

    // 안 읽은 채팅 개수 전달 (사용자)
    async chatCount(userId: number){
        const patient = await this.patientRepository.findOne({
            where: {user: {id: userId}},
            relations: ['admin']
        });

        if (!patient || !patient.admin) {
            throw new Error('연결된 관리자가 없습니다.');
        }

        const adminId = patient.admin.id; // 연결된 환자로 관리자id 찾기

        const room = await this.chatRoomRepository.findOne({
            where: {
                user: { id: userId },
                admin: { id: adminId },
            },
        }); // 보호자-관리자 속한 채팅방 찾기

        if (!room) {
            throw new Error('연결된 채팅방이 없습니다.');
        }

        const unreadCount = await this.chatRepository.count({
            where: {
                room: {id: room.id},
                sender: 'admin',
                read: false
            }
        }); // 해당 채팅방의 'admin'이 보낸 메시지 중 아직 읽지 않은 것의 개수
        
        return unreadCount;
    }
}
