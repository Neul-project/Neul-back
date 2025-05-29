import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor (private readonly mailService: MailService) {}

    // 비밀번호 찾기 검증 메일 전송
    @Post('/send-code')
    async sendEmail(@Body() body){
        return this.mailService.sendEmail(body.email);
    }

    // 비밀번호 인증코드 확인
    @Post('/verify-code')
    async verifyEmail(@Body() body){
        console.log(body, '콘솔확인');
        return this.mailService.verifyEmail(body.email, body.code);
    }
}
