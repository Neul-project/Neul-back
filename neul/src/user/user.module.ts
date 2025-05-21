import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'entities/users';
import { Match } from 'entities/match';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Match])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
