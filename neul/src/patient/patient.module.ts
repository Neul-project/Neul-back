import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from 'entities/patients';
import { Users } from 'entities/users';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, Users])],
  providers: [PatientService],
  controllers: [PatientController]
})
export class PatientModule {}
