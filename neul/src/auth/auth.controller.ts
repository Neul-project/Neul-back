import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingupUserDto } from 'src/auth/dto/signup-user.dto';
import { KakaoAuthGuard, LocalAuthGuard, NaverAuthGuard } from './auth.guard';
import { CheckDuplicateDto } from './dto/check-duplicate.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // 회원가입
    @Post('/signup')
    async signup(@Body() dto: SingupUserDto) {
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

    // 카카오 로그인 요청
    @Get('/kakao')
    @UseGuards(KakaoAuthGuard)
    async kakaoLogin() {}

    // 카카오 콜백처리
    @Get('/kakao/callback')
    @UseGuards(KakaoAuthGuard)
    async kakaoCallback(@Req() req, @Res() res){
        const user = req.user;
        const {snsAccess, snsRefresh} = await this.authService.kakaoUser(user);
        return res.redirect(`http://localhost:3000?snsAccess=${snsAccess}&snsRefresh=${snsRefresh}`);
    }

    // 네이버 로그인 요청
    @Get('/naver')
    @UseGuards(NaverAuthGuard)
    async naverLogin() {}

    // 네이버 콜백처리
    @Get('/naver/callback')
    @UseGuards(NaverAuthGuard)
    async naverCallback(@Req() req, @Res() res){
        const user = req.user;
        const {snsAccess, snsRefresh} = await this.authService.naverUser(user);
        return res.redirect(`http://localhost:3000?snsAccess=${snsAccess}&snsRefresh=${snsRefresh}`);
    }
}
