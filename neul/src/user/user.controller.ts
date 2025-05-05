import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 회원탈퇴
    @Delete('/withdraw')
    @UseGuards(JwtAuthGuard)
    async userDelete(@Req() req){
        const userId = req.user.id
        return await this.userService.userDel(userId);
    }
}
