import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'entities/users';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {}

    // 회원 탈퇴
    async userDel(userId: number) {
        return await this.userRepository.delete({ id: userId });
    }
}
