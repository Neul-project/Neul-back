import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from 'entities/chats';
import { Users } from 'entities/users';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chats)
        private chatRepository: Repository<Chats>,
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

        const chat = this.chatRepository.create({
            user,
            admin,
            message
        });
        return await this.chatRepository.save(chat);
    }

    // 채팅목록 전달
    async getChatList(userId: number){
        const chat = await this.chatRepository.find({
            where: {user: {id: userId}},
            order: {created_at: 'ASC'},
            relations: ['user', 'admin'],
        });
        
        return chat;
    }
}
