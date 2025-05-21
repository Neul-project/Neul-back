import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { HelperController } from './helper.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'entities/users';
import { Helper } from 'entities/helpers';
import { Alert } from 'entities/alert';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Helper, Alert])],
  providers: [HelperService],
  controllers: [HelperController]
})
export class HelperModule {}
