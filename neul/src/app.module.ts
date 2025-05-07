import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PatientModule } from './patient/patient.module';
import { ActivityModule } from './activity/activity.module';
import { StatusModule } from './status/status.module';
import { ProgramModule } from './program/program.module';
import { ChatModule } from './chat/chat.module';
import { ShiftModule } from './shift/shift.module';
import { BannerModule } from './banner/banner.module';

import { Users } from 'entities/users';
import { Patients } from 'entities/patients';
import { UserCheck } from 'entities/user_check';
import { Activities } from 'entities/activities';
import { Feedback } from 'entities/feedback';
import { Programs } from 'entities/programs';
import { Pay } from 'entities/pay';
import { Refund } from 'entities/refund';
import { Status } from 'entities/status';
import { Chats } from 'entities/chats';
import { Shifts } from 'entities/shifts';
import { Match } from 'entities/match';
import { Banners } from 'entities/banners';


@Module({
  imports: [
    ConfigModule.forRoot({ // 환경변수 설정
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({ // TypeORM 설정 (db 연결)
      type: 'mysql',
      host: 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Users, Patients, UserCheck, Activities, Feedback, Programs, Pay, Refund, Status, Chats, Shifts, Match, Banners],
      charset: 'utf8mb4',
      synchronize: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    
    AuthModule,
    UserModule,
    PatientModule,
    ActivityModule,
    StatusModule,
    ProgramModule,
    ChatModule,
    ShiftModule,
    BannerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
