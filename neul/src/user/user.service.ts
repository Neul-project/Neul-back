import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    // 주소 저장
    async getAddress(userId: number, newAddress: string){
        const user = await this.userRepository.findOne({ where: {id: userId}});
        if(!user){
            throw new UnauthorizedException('등록되지 않은 사용자입니다.')
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
}
