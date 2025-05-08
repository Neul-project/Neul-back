import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AddUserDto } from './dto/add-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { AdminListDto } from './dto/res/admin-list.dto';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 소셜로그인 사용자 추가정보 입력
    @Post('/info')
    @UseGuards(JwtAuthGuard)
    async addUser(@Body() dto: AddUserDto, @Req() req){
        const userId = req.user.id;
        return await this.userService.addUser(userId, dto);
    }

    // 관리자 전체 명단 전달
    @Get('/adminlist')
    @ApiResponse({type: AdminListDto})
    async adminAll(){
        return await this.userService.adminALl();
    }

    // 회원탈퇴
    @Delete('/withdraw')
    @UseGuards(JwtAuthGuard)
    async userDelete(@Req() req){
        const userId = req.user.id;
        return await this.userService.userDel(userId);
    }
}
