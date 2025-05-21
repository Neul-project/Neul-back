import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Helper } from 'entities/helpers';
import { Users } from 'entities/users';
import { HelperSignupDto } from 'src/helper/dto/req/helper-signup.dto';
import { Repository } from 'typeorm';

@Injectable()
export class HelperService {
    constructor(
        @InjectRepository(Helper)
        private helperRepository: Repository<Helper>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {}

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

    // 승인대기 도우미 전체 전달
    async helperApply(){
        return await this.helperRepository.find({ where: {status: '승인 대기'} });
    }
}
