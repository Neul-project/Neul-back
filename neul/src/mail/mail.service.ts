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

        const code = Math.floor(100000 + Math.random() * 900000); // 인증번호 랜덤생성
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 인증 만료시간 계산

        await this.mailRepository.delete({email: checkEmail});

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
                <div style="width: 100%; background-color: #fef6d4; padding: 30px 0;">
                <table align="center" width="600" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif;">
                    <tr>
                    <td style="padding: 30px; text-align: center;">
                        <h2 style="color: #333;">비밀번호 재설정 인증</h2>
                        <p style="font-size: 16px; color: #555;">본인이 요청한 것이 맞나요?</p>
                        <p style="font-size: 14px; color: #555; margin: 20px 0;">
                        비밀번호 재설정을 요청하셨다면, 아래 인증번호를 입력해주세요.
                        </p>
                        <div style="margin: 20px 0;">
                        <span style="display: inline-block; padding: 15px 25px; font-size: 24px; background-color: #79b79d; color: white; border-radius: 6px; letter-spacing: 4px;">
                            ${code}
                        </span>
                        </div>
                        <p style="font-size: 14px; color: #999;">인증번호는 5분간 유효합니다.</p>
                        <p style="font-size: 13px; color: #aaa; margin-top: 40px;">문의사항이 있으시면 고객센터로 연락 주세요.</p>
                    </td>
                    </tr>
                    <tr>
                    <td style="background-color: #ffffff; text-align: center; padding: 20px;">
                        <p style="font-size: 12px; color: #999;">Neul Corp. | <a href="https://www.neul.com" style="color: #999; text-decoration: none;">www.neul.com</a></p>
                    </td>
                    </tr>
                </table>
                </div>
            `,
        };

        await this.transporter.sendMail(mailOptions);
        
        return {ok: true};
    }
}
