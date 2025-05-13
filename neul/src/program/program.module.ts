import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programs } from 'entities/programs';
import { Users } from 'entities/users';
import { Pay } from 'entities/pay';
import { Refund } from 'entities/refund';

@Module({
  imports: [TypeOrmModule.forFeature([Programs, Users, Pay, Refund])],
  providers: [ProgramService],
  controllers: [ProgramController]
})
export class ProgramModule {}
