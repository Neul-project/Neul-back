import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'entities/users';
import { Patients } from 'entities/patients';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({ // 토큰 발급 기능 등록
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '1d'},
    }),
    TypeOrmModule.forFeature([Users, Patients])
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule]
})
export class AuthModule {}
