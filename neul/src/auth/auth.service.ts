import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from 'entities/users';
import { Patients } from 'entities/patients';
import { SingupUserDto } from 'src/auth/dto/req/signup-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserCheck } from 'entities/user_check';
import { FindEmailDto } from './dto/req/find-email.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService : JwtService,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Patients)
        private patientRepository: Repository<Patients>,
        @InjectRepository(UserCheck)
        private userCheckRepository: Repository<UserCheck>
    ) {}

    // 회원가입
    async signup(dto: SingupUserDto){
        const { email, password, name, phone, role } = dto;

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('이미 존재하는 이메일입니다.');
        } 

        const hashPW = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({                        
            email,
            password: hashPW,
            name,
            phone,
            role,
        });
        const savedUser = await this.userRepository.save(newUser);
        
        return { userId: savedUser.id };
    }

    // 로컬로그인
    async localLogin(email: string, password: string){
        const user = await this.userRepository.findOne({where: { email }});
        if(!user){
            throw new UnauthorizedException('등록되지 않은 사용자입니다.')
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match){
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.')
        }

        // 토큰 발급
        const payload = { id: user.id, email: user.email };
        const newToken = this.jwtService.sign(payload);

        return { payload, newToken };
    }

    // 로그인한 유저 정보 전달
    async loginMe(userId: number){
        const user = await this.userRepository.findOne({ 
            where: {id: userId},
            select: ['id', 'name', 'provider'],
        });
        return user;
    }

    // 이메일 중복확인
    async checkEmail(email: string){
        const user = await this.userRepository.findOne({ where: {email}});
        return { isDuplicate: !!user };
    }

    // 비밀번호 중복확인
    async checkPhone(phone: string){
        const user = await this.userRepository.findOne({ where: {phone}}); 
        return { isDuplicate: !!user };
    }

    // 소셜 토큰 생성
    async snsToken(user: any){
        const payload = {
            id: user.id,
            email: user.email,
            provider: user.provider,
        }

        const snsAccess = this.jwtService.sign(payload);
        const snsRefresh = this.jwtService.sign(payload, {expiresIn: '7d'})

        return { snsAccess, snsRefresh };
    }

    // 카카오 로그인
    async kakaoUser(snsUser: any){
        const { email } = snsUser;

        let user = await this.userRepository.findOne({ where: {email}});
        if(!user){
            user = this.userRepository.create({
                email,
                provider: 'kakao',
            });
            await this.userRepository.save(user);
        }

        return this.snsToken(user);
    }

    // 네이버 로그인
    async naverUser(snsUser: any){
        const { email } = snsUser;

        let user = await this.userRepository.findOne({ where: {email}});
        if(!user){
            user = this.userRepository.create({
                email,
                provider: 'naver',
            });
            await this.userRepository.save(user);
        }

        return this.snsToken(user);
    }

    // 이용약관 저장
    async userAgree(userId: number, term: string[]){
        const user = await this.userRepository.findOne({ where: {id: userId}});
        if(!user){
            throw new UnauthorizedException('등록되지 않은 사용자입니다.')
        }

        const userCheck = this.userCheckRepository.create({
            user: user,
            term: JSON.stringify(term)
        });
        await this.userCheckRepository.save(userCheck);

        return { ok: true };
    }

    // 비밀번호 변경
    async updatePW(userId:number, newPassword: string){
        const user = await this.userRepository.findOne({ where: {id: userId}});
        if(!user){
            throw new UnauthorizedException('등록되지 않은 사용자입니다.')
        }

        const hasPw = await bcrypt.hash(newPassword, 10);
        user.password = hasPw;
        await this.userRepository.save(user);

        return { ok: true };
    }

    // 아이디 찾기
    async findEmail(dto: FindEmailDto){
        const user = await this.userRepository.findOne({ 
            where: {
                name: dto.name,
                phone: dto.phone
            }}
        );
        if(!user){
            return {ok: false};
        }

        return {email: user.email};
    }
}
