import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chats } from 'entities/chats';
import { ChatGateway } from './chat.gateway';
import { Users } from 'entities/users';
import { ChatRoom } from '../../entities/chat_room';

@Module({
  imports: [TypeOrmModule.forFeature([Chats, Users, ChatRoom])],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController]
})
export class ChatModule {}
