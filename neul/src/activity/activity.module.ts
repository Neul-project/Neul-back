import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'entities/users';
import { Patients } from 'entities/patients';
import { Activities } from 'entities/activities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Patients, Activities])
  ],
  controllers: [ActivityController],
  providers: [ActivityService]
})
export class ActivityModule {}
