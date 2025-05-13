import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'entities/users';
import { Patients } from 'entities/patients';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Patients])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
