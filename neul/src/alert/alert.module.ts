import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from 'entities/alert';

@Module({
  imports: [TypeOrmModule.forFeature([Alert])],
  providers: [AlertService],
  controllers: [AlertController]
})
export class AlertModule {}
