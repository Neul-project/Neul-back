import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingupUserDto } from 'src/auth/dto/signup-user.dto';
import { LocalAuthGuard } from './auth.guard';
import { CheckDuplicateDto } from './dto/check-duplicate.dto';

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

    // 이메일 핸드폰번호 중복확인
    @Get('/check')
    async checkDuplicate(@Query() query: CheckDuplicateDto){
        if(query.email){
            return this.authService.checkEmail(query.email);
        }

        if(query.phone){
            return this.authService.checkPhone(query.phone);
        }
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
