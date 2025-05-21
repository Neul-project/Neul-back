import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { HelperController } from './helper.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'entities/users';
import { Helper } from 'entities/helpers';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Helper])],
  providers: [HelperService],
  controllers: [HelperController]
})
export class HelperModule {}
