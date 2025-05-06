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

        return await this.userRepository.save(user);
    }

    // 관리자 전체 명단 전달
    async adminALl(){
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
}
