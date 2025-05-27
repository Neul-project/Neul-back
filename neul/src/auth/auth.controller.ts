import { Body, Controller, Get, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingupUserDto } from 'src/auth/dto/req/signup-user.dto';
import { JwtAuthGuard, KakaoAuthGuard, LocalAuthGuard, NaverAuthGuard } from './auth.guard';
import { CheckDuplicateDto } from './dto/req/check-duplicate.dto';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { DuplicateCheckDto } from './dto/res/duplicate-check';
import { AgreeCheckDto } from './dto/req/agree-check.dto';
import { UserIdDto } from './dto/res/user-id.dto';
import { UpdatePWDto } from './dto/req/update-pw.dto';
import { LocalLoginDto } from './dto/req/local-login.dto';
import { SendTokenDto } from './dto/res/send-token.dto';
import { LoginMeDto } from './dto/res/login-me.dto';
import { SnsTokenDto } from './dto/res/sns-token.dto';
import { FindInfoDto } from './dto/req/find-info.dto';
import { SendEmailDto } from './dto/res/send-email.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // 회원가입
    @Post('/signup')
    @ApiResponse({type: UserIdDto})
    async signup(@Body() dto: SingupUserDto) {
        return this.authService.signup(dto);
    }

    // 로컬로그인
    @Post('/local')
    @UseGuards(LocalAuthGuard)
    @ApiBody({type: LocalLoginDto})
    @ApiResponse({type: SendTokenDto})
    async localLogin(@Req() req){
        const user = req.user;
        return { user: user.payload, token: user.newToken }
    }

    // 로그인한 유저 정보 전달
    @Get('/me')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({type: LoginMeDto})
    async loginMe(@Req() req){
        const userId = req.user.id;
        return this.authService.loginMe(userId);
    }

    // 이메일 핸드폰번호 중복확인
    @Get('/check')
    @ApiQuery({name: 'email', required: false})
    @ApiQuery({name: 'phone', required: false})
    @ApiResponse({type: DuplicateCheckDto})
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
    @ApiResponse({type: SnsTokenDto})
    async kakaoCallback(@Req() req, @Res() res){
        const user = req.user;
        const {snsAccess, snsRefresh} = await this.authService.kakaoUser(user);
        return res.redirect(`http://3.38.125.252?snsAccess=${snsAccess}&snsRefresh=${snsRefresh}`);
    }

    // 네이버 로그인 요청
    @Get('/naver')
    @UseGuards(NaverAuthGuard)
    async naverLogin() {}

    // 네이버 콜백처리
    @Get('/naver/callback')
    @UseGuards(NaverAuthGuard)
    @ApiResponse({type: SnsTokenDto})
    async naverCallback(@Req() req, @Res() res){
        const user = req.user;
        const {snsAccess, snsRefresh} = await this.authService.naverUser(user);
        return res.redirect(`http://3.38.125.252?snsAccess=${snsAccess}&snsRefresh=${snsRefresh}`);
    }

    // 이용약관 동의
    @Post('/agreements')
    async userAgreements(@Body() dto: AgreeCheckDto){
        return await this.authService.userAgree(dto.userId, dto.term);
    }

    // 비밀번호 변경
    @Patch('/password')
    async updatePW(@Body() dto: UpdatePWDto){
        return this.authService.updatePW(dto.email, dto.newPassword);
    }

    // 아이디/비밀번호 찾기
    @Post('/find')
    @ApiResponse({type: SendEmailDto})
    async findEmail(@Body() dto: FindInfoDto){
        if(dto.type === 'email'){
            return this.authService.findEmail(dto);
        }

        if(dto.type === 'pw'){
            return this.authService.findPaasword(dto);
        }
    }
}
