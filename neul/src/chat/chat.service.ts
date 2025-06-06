import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'entities/chat_room';
import { Chats } from 'entities/chats';
import { Match } from 'entities/match';
import { Patients } from 'entities/patients';
import { Users } from 'entities/users';
import { In, Repository } from 'typeorm';

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
    async saveChat({roomId, message, sender}){        
        // 해당 유저-관리자 채팅방
        let room = await this.chatRoomRepository.findOne({
            where: { id: roomId },
            relations: ['user', 'admin'],
        });

        if (!room) {
            throw new Error('연결된 도우미가 없습니다.');
        }

        const chat = this.chatRepository.create({
            user: room.user,
            admin: room.admin,
            message,
            room,
            sender
        });
        return await this.chatRepository.save(chat);
    }

    // 채팅목록 전달 (사용자+관리자)
    async getChatList(roomId: number, page: number, limit: number){
        const room = await this.chatRoomRepository.findOne({
            where:{ id: roomId }
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
    async getChatroomList(adminId: number, page: number, limit: number){
        const latestChatSubquery = this.chatRepository
            .createQueryBuilder('chat')
            .select([
                'chat.roomId AS roomId',
                'chat.message AS lastMessage',
                'chat.created_at AS lastTime',
                'ROW_NUMBER() OVER (PARTITION BY chat.roomId ORDER BY chat.created_at DESC) AS sub',
            ]);

        const scrollSubquery = this.chatRoomRepository
            .createQueryBuilder('sub')
            .select('sub.id', 'id')
            .where('sub.adminId = :adminId', { adminId })
            .orderBy('sub.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const chatRoom = await this.chatRoomRepository
            .createQueryBuilder('room')
            .innerJoin(
                '(' + scrollSubquery.getQuery() + ')',
                'scroll',
                'scroll.id = room.id'
            )
            .leftJoin('room.user', 'user') // 보호자
            .leftJoin('room.admin', 'admin') // 관리자
            .leftJoin('user.familyPatients', 'patient') // 보호자의 피보호자
            .leftJoin('room.chats', 'chat')
            .leftJoin('match', 'match', 'match.adminId = :adminId AND match.userId = user.id', { adminId })            
            .leftJoin(
                '(' + latestChatSubquery.getQuery() + ')',
                'latest',
                'latest.roomId = room.id AND latest.sub = 1'
            )
            .setParameters({
                ...latestChatSubquery.getParameters(),
                ...scrollSubquery.getParameters(),
            })            
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
                'CASE WHEN match.id IS NOT NULL THEN 1 ELSE 0 END AS isMatched', // 매칭여부
                'room.adminDel AS roomDel' // 삭제 여부
            ])
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

    // 채팅방 전달 (사용자)
    async getChatroomListUser(userId: number, page: number, limit: number){
        const latestChatSubquery = this.chatRepository
            .createQueryBuilder('chat')
            .select([
                'chat.roomId AS roomId',
                'chat.message AS lastMessage',
                'chat.created_at AS lastTime',
                'ROW_NUMBER() OVER (PARTITION BY chat.roomId ORDER BY chat.created_at DESC) AS sub',
            ])
            .where('chat.userDel = false');

        const scrollSubquery = this.chatRoomRepository
            .createQueryBuilder('sub')
            .select('sub.id', 'id')
            .where('sub.userId = :userId', { userId })
            .skip((page - 1) * limit)
            .take(limit);

        const chatRoom = await this.chatRoomRepository
            .createQueryBuilder('room')
            .innerJoin(
                '(' + scrollSubquery.getQuery() + ')',
                'scroll',
                'scroll.id = room.id'
            )
            .leftJoin('room.admin', 'admin') // 관리자
            .leftJoin('room.chats', 'chat')
            .leftJoin('match', 'match', 'match.userId = :paramUserId AND match.adminId = room.adminId', { paramUserId: userId })            
            .leftJoin(
                '(' + latestChatSubquery.getQuery() + ')',
                'latest',
                'latest.roomId = room.id AND latest.sub = 1'
            )
            .setParameters({
                ...latestChatSubquery.getParameters(),
                ...scrollSubquery.getParameters(),
            })            
            .select([
                'room.id AS id', // 고유 id
                'admin.id AS adminId', // 도우미 id
                'admin.name AS adminName', // 도우미 이름
                'COALESCE(latest.lastTime, room.created_at) AS lastTime', // 마지막 채팅 보낸 시각
                `COALESCE(latest.lastMessage, '') AS lastMessage`, // 마지막으로 보낸 채팅 내용
                `COALESCE(SUM(CASE 
                    WHEN chat.read = false AND chat.adminId = room.adminId AND chat.sender = 'admin' 
                    THEN 1 ELSE 0 END), 0) AS unreadCount`, // 안 읽은 알림 개수
                'CASE WHEN match.id IS NOT NULL THEN 1 ELSE 0 END AS isMatched', // 매칭여부
                'room.userDel AS roomDel' // 삭제 여부
            ])
            .groupBy('room.id')
            .addGroupBy('admin.id')
            .addGroupBy('admin.name')
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

    // 안 읽은 채팅 개수 전달 (메인)
    async chatCount(userId: number){
        const rooms = await this.chatRoomRepository.find({where: {user: {id: userId}}});
        if (!rooms.length) return;

        const roomIds = rooms.map((room) => room.id); // 해당 사용자 모든 채팅방 찾기

        const unreadCount = await this.chatRepository.count({
            where: {
                room: {id: In(roomIds)},
                sender: 'admin',
                read: false,
                userDel: false
            }
        }); // 'admin'이 보낸 메시지 중 아직 읽지 않은 것의 개수
        
        return unreadCount;
    }

    // 읽음처리 (관리자)
    async chatRead(roomId: number){
        const room = await this.chatRoomRepository.findOne({where: {id: roomId}});
        if (!room) {
            throw new NotFoundException('해당 채팅방이 존재하지 않습니다.');
        }

        // 해당 채팅방의 'user'가 보낸 메시지 중 아직 읽지 않은 것들을 읽음 처리
        return await this.chatRepository
            .createQueryBuilder()
            .update()
            .set({ read: true })
            .where('roomId = :roomId', { roomId })
            .andWhere('sender = :sender', { sender: 'user' })
            .andWhere('read = false')
            .execute();
    }

    // 읽음처리 (사용자)
    async chatReadUser(roomId: number){
        const room = await this.chatRoomRepository.findOne({where: {id: roomId}});
        if (!room) {
            throw new NotFoundException('해당 채팅방이 존재하지 않습니다.');
        }

        // 해당 채팅방의 'admin'이 보낸 메시지 중 아직 읽지 않은 것들을 읽음 처리
        return await this.chatRepository
            .createQueryBuilder()
            .update()
            .set({ read: true })
            .where('roomId = :roomId', { roomId })
            .andWhere('sender = :sender', { sender: 'admin' })
            .andWhere('read = false')
            .execute();
    }

    // 채팅내역 삭제 (사용자)
    async chatDel(roomId: number){
        return await this.chatRepository.update(
            { room: { id: roomId } },
            { userDel: true },
        );
    }

    // 채팅방 삭제
    async roomExit(roomId: number, type: 'user' | 'admin'){
        const room = await this.chatRoomRepository.findOne({ where: {id: roomId} });
        if(!room){
            throw new Error('채팅방이 존재하지 않습니다.')
        }

        if(type === 'user'){
            room.userDel = true;
        }
        if(type === 'admin'){
            room.adminDel = true;
        }

        if(room.userDel && room.adminDel){ // 사용자/도우미 둘 다 삭제했을 경우 채팅방/내역 삭제
            return await this.chatRoomRepository.remove(room);
        }

        return await this.chatRoomRepository.save(room);
    }
}
