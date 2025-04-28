import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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
      // entities: [Users],
      charset: 'utf8mb4',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
