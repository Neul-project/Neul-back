import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'entities/users';
import { Repository } from 'typeorm';
import { AddUserDto } from './dto/add-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {}

    // 소셜로그인 사용자 추가정보 입력
    async addUser(userId: number, dto: AddUserDto){
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

    // 회원 탈퇴
    async userDel(userId: number) {
        return await this.userRepository.delete({ id: userId });
    }

    // 전체 유저 전달
    async userAll(){
        const users = await this.userRepository.find({
            relations: ['familyPatients']
        });

        return users.map(x => {
            const patient = x.familyPatients?.[0];

            return {
                id: x.id,
                email: x.email,
                name: x.name,
                phone: x.phone,
                patient_id: patient?.id || null,
                patient_name: patient?.name || '등록안함',
                patient_gender: patient?.gender || '등록안함',
                patient_birth: patient?.birth || '등록안함',
                patient_note: patient?.note || '등록안함',
            };
        })
    }
}
