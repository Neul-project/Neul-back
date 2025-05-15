import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chats } from 'entities/chats';
import { ChatGateway } from './chat.gateway';
import { Users } from 'entities/users';
import { ChatRoom } from '../../entities/chat_room';
import { Patients } from 'entities/patients';
import { Match } from 'entities/match';

@Module({
  imports: [TypeOrmModule.forFeature([Chats, Users, ChatRoom, Patients, Match])],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController]
})
export class ChatModule {}
