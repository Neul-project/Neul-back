import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'entities/users';
import { Mail } from 'entities/mail';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Mail])],
  providers: [MailService],
  controllers: [MailController]
})
export class MailModule {}
