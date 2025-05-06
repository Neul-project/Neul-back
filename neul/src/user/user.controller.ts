import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AddUserDto } from './dto/add-user.dto';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 추가정보 입력
    @Post('/info')
    async addUser(@Body() dto: AddUserDto){
        return await this.userService.addUser(dto);
    }

    // 회원탈퇴
    @Delete('/withdraw')
    @UseGuards(JwtAuthGuard)
    async userDelete(@Req() req){
        const userId = req.user.id
        return await this.userService.userDel(userId);
    }
}
