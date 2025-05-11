import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'entities/users';
import { Patients } from 'entities/patients';
import { ChatRoom } from 'entities/chat_room';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Patients, ChatRoom])],
  providers: [MatchingService],
  controllers: [MatchingController]
})
export class MatchingModule {}
