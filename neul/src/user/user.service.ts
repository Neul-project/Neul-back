import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'entities/users';
import { Repository } from 'typeorm';
import { Match } from 'entities/match';
import { FindEmailDto } from 'src/auth/dto/req/find-email.dto';
import { Helper } from 'entities/helpers';
import { HelperSignupDto } from './dto/req/helper-signup.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
        @InjectRepository(Helper)
        private helperRepository: Repository<Helper>,
    ) {}

    // 소셜로그인 사용자 추가정보 입력
    async addUser(userId: number, dto: FindEmailDto){
        const user = await this.userRepository.findOne({ where: {id: userId}})
        if(!user){
            throw new Error('해당 유저를 찾을 수 없습니다.');
        }
        if (user.provider === 'local') {
            throw new Error('로컬 계정은 추가 정보 입력이 불필요합니다.');
        }

        user.name = dto.name;
        user.phone = dto.phone;

        await this.userRepository.save(user);

        return { ok: true };
    }

    // 관리자 전체 명단 전달
    async adminAll(){
        const admin = await this.userRepository.find({
            where: {role: 'admin'},
            select: ['id', 'name']
        });

        return admin.map((x) => ({
            value: x.id,
            label: x.name,
        }));
    }

    // 도우미 프로필 정보 저장
    async helperSign(dto: HelperSignupDto, files: {profileImage: Express.Multer.File[]; certificate: Express.Multer.File[]}){
        const user = await this.userRepository.findOne({ where: {id: Number(dto.userId)}});
        if(!user){
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        const helper = this.helperRepository.create({
            user,
            desiredPay: Number(dto.desiredPay),
            experience: dto.experience,
            birth: dto.birth,
            gender: dto.gender,
            certificateName: dto.certificateName_01,
            certificateName2: dto.certificateName_02,
            certificateName3: dto.certificateName_03,
            profileImage: files.profileImage?.[0].originalname ?? '',
            certificate: files.certificate?.[0].originalname ?? '',
        });
        await this.helperRepository.save(helper);

        return {ok: true};
    }

    // 회원 탈퇴
    async userDel(userId: number) {
        return await this.userRepository.delete({ id: userId });
    }

    // 주소 저장
    async getAddress(userId: number, newAddress: string){
        const user = await this.userRepository.findOne({ where: {id: userId}});
        if(!user){
            throw new UnauthorizedException('등록되지 않은 사용자입니다.');
        }

        user.address = newAddress;
        await this.userRepository.save(user);

        return { ok: true };
    }

    // 유저 정보 전달
    async getUserInfo(userId: number){
        const user = await this.userRepository.findOne({ 
            where: {id: userId},
            select: ['name', 'email', 'phone', 'address']
        });

        return user;
    }

    // 매칭된 관리자 id 전달
    async getMatchAdmin(userId: number){
        const match = await this.matchRepository.findOne({
            where: {user: {id: userId}},
            relations: ['admin']
        });

        if(!match) return;

        return match.admin.id;
    }
}
