import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programs } from 'entities/programs';

@Module({
  imports: [TypeOrmModule.forFeature([Programs])],
  providers: [ProgramService],
  controllers: [ProgramController]
})
export class ProgramModule {}
