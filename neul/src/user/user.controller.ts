import { Body, Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AddUserDto } from './dto/add-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { AdminListDto } from './dto/res/admin-list.dto';
import { UserPatientDto } from '../matching/dto/res/user-patient.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UserInfoDto } from './dto/res/user-info.dto';
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
        return await this.userService.adminAll();
    }

    // 회원탈퇴
    @Delete('/withdraw')
    @UseGuards(JwtAuthGuard)
    async userDelete(@Req() req){
        const userId = req.user.id;
        return await this.userService.userDel(userId);
    }

    // 주소 저장
    @Post('/address')
    @UseGuards(JwtAuthGuard)
    async getAddress(@Body() dto: CreateAddressDto, @Req() req){
        const userId = req.user.id;
        return this.userService.getAddress(userId, dto.address);
    }

    // 유저 정보 전달
    @Get('/info')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({type: UserInfoDto})
    async userInfo(@Req() req){
        const userId = req.user.id;
        return this.userService.getUserInfo(userId);
    }

    // 매칭된 관리자 id 전달
    @Get('/admin')
    @UseGuards(JwtAuthGuard)
    async matchAdmin(@Req() req){
        const userId = req.user.id;
        return this.userService.getMatchAdmin(userId);
    }
}