import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // 카카오 로그인 API
    @Get('/kakao')
    // @UseGuards(AuthGuard('kakao'))
    async kakaoLogin() {}

    // 네이버 로그인 API
    @Get('/naver')
    // @UseGuards(AuthGuard('naver'))
    async naverLogin() {}
}
