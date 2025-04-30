import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingupUserDto } from 'src/user/dto/signup-user.dto';
import { LocalAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // 회원가입
    @Post('/signup')
    async signup(@Body() dto: SingupUserDto) {
        console.log(dto, '회원가입 전달받은 값');
        return this.authService.signup(dto);
    }

    // 로컬로그인
    @Post('/local')
    @UseGuards(LocalAuthGuard)
    async localLogin(@Req() req){
        const user = req.user;
        return { user: user.payload, token: user.newToken }
    }

    // 카카오 로그인 API
    @Get('/kakao')
    // @UseGuards(AuthGuard('kakao'))
    async kakaoLogin() {}

    // 네이버 로그인 API
    @Get('/naver')
    // @UseGuards(AuthGuard('naver'))
    async naverLogin() {}
}
