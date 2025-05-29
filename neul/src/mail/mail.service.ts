import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mail } from 'entities/mail';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Users } from 'entities/users';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
            user: process.env.GOOGLE_EMAIL_USER,
            pass: process.env.GOOGLE_EMAIL_PASS,
        }
    })

    constructor(
        @InjectRepository(Mail)
        private mailRepository: Repository<Mail>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {}

    // 비밀번호 찾기 검증 메일 전송
    async sendEmail(checkEmail: string){
        const user = await this.userRepository.findOne({where: {email: checkEmail}});
        if(!user){
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        const exMail = await this.mailRepository.findOne({where: {email: checkEmail}});
        if(exMail){
            await this.mailRepository.delete({email: checkEmail});
        }

        const code = Math.floor(100000 + Math.random() * 900000); // 인증번호 랜덤생성
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 인증 만료시간 계산

        const mailVerification = this.mailRepository.create({ // 인증정보 저장
            email: checkEmail,
            code,
            expiresAt
        });
        await this.mailRepository.save(mailVerification);

        const mailOptions = { // 이메일 전송
            from: process.env.GOOGLE_EMAIL_USER,
            to: checkEmail,
            subject: '[NEUL 인증메일]',
            html: `
                <table width="600" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #f9f9f9; overflow: hidden; font-family: Arial, sans-serif;">
                    <tr>
                        <td style="padding: 30px; text-align: center; boarder: 1px solid black;">
                            <h2 style="color: #000000;">비밀번호 재설정 인증</h2>
                            <p style="font-size: 16px; color: #333333;">본인이 요청한 것이 맞나요?</p>
                            <p style="font-size: 14px; color: #333333; margin: 20px 0;">
                                비밀번호 재설정을 요청하셨다면, 아래 인증번호를 입력해주세요.
                            </p>
                            <div style="margin: 20px 0;">
                                <span style="display: inline-block; padding: 15px 25px; font-size: 24px; background-color: #79b79d; color: white; border-radius: 6px; letter-spacing: 4px;">
                                    ${code}
                                </span>
                            </div>
                            <p style="font-size: 14px; color: #666666;">인증번호는 5분간 유효합니다.</p>
                            <p style="font-size: 13px; color: #999999; margin-top: 40px;">문의사항이 있으시면 고객센터로 연락 주세요.</p>
                        </td>
                    </tr>
                    <tr>
                    <td style="background-color: #ffffff; text-align: center; padding: 20px; boarder: 1px solid black;">
                        <p style="font-size: 12px; color: #666666;">Neul Corp. | <a href="http://3.38.125.252" style="color: #999; text-decoration: none;">www.neul.com</a></p>
                    </td>
                    </tr>
                </table>
            `,
        };

        await this.transporter.sendMail(mailOptions);
        
        return {ok: true};
    }

    // 비밀번호 인증코드 확인
    async verifyEmail(email: string, inputCode: number){
        const mail = await this.mailRepository.findOne({
            where: {email},
            order: {createdAt: 'DESC'}
        });

        if(!mail){
            return {type: 1}; // 인증기록이 없습니다.
        }
        if(mail.isVerified){
            return {type: 2}; // 이미 인증되었습니다.
        }
        if(mail.expiresAt < new Date()){
            return {type: 3}; // 인증번호가 만료되었습니다.
        }
        if(mail.code !== inputCode){
            return {type: 4} // 인증번호가 일치하지 않습니다.
        }

        mail.isVerified = true;
        await this.mailRepository.save(mail);

        return {ok: true};
    }
}
