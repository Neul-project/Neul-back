import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from 'entities/status';
import { Users } from 'entities/users';
import { Patients } from 'entities/patients';

@Module({
  imports: [
    TypeOrmModule.forFeature([Status, Users, Patients])
  ],
  controllers: [StatusController],
  providers: [StatusService]
})
export class StatusModule {}
