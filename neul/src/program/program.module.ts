import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programs } from 'entities/programs';
import { Users } from 'entities/users';
import { Pay } from 'entities/pay';
import { Refund } from 'entities/refund';
import { Cart } from 'entities/cart';
import { Alert } from 'entities/alert';
import { PayPrograms } from 'entities/pay_program';
import { Match } from 'entities/match';
import { Charge } from 'entities/charge';

@Module({
  imports: [TypeOrmModule.forFeature([Programs, Users, Pay, Refund, Cart, Alert, PayPrograms, Match, Charge])],
  providers: [ProgramService],
  controllers: [ProgramController]
})
export class ProgramModule {}
