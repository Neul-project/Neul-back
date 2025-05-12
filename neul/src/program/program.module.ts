import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programs } from 'entities/programs';
import { Users } from 'entities/users';
import { Pay } from 'entities/pay';

@Module({
  imports: [TypeOrmModule.forFeature([Programs, Users, Pay])],
  providers: [ProgramService],
  controllers: [ProgramController]
})
export class ProgramModule {}
