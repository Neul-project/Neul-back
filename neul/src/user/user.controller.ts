import { Body, Controller, Delete, Get, Post, Query, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { AdminListDto } from './dto/res/admin-list.dto';
import { CreateAddressDto } from './dto/req/create-address.dto';
import { UserInfoDto } from './dto/res/user-info.dto';
import { FindEmailDto } from 'src/auth/dto/req/find-email.dto';
import { UserIdDto } from 'src/auth/dto/res/user-id.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { HelperSignupDto } from './dto/req/helper-signup.dto';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 소셜로그인 사용자 추가정보 입력
    @Post('/info')
    @UseGuards(JwtAuthGuard)
    async addUser(@Body() dto: FindEmailDto, @Req() req){
        const userId = req.user.id;
        return await this.userService.addUser(userId, dto);
    }

    // 도우미 전체 명단 전달
    @Get('/adminlist')
    @ApiResponse({type: AdminListDto})
    async adminAll(){
        return await this.userService.adminAll();
    }

    // 도우미 프로필 정보 저장
    @Post('/helper-signup')
    @UseInterceptors(
        FileFieldsInterceptor(
            [{ name: 'profileImage', maxCount: 1 }, { name: 'certificate', maxCount: 1 }],
            {
                storage: diskStorage({
                    destination: join(process.cwd(), 'uploads/file'),
                    filename: (req, file, callback) => {
                        const uniqueName = `${file.originalname}`;
                        callback(null, uniqueName);
                    },
                }),
            },
        )
    )
    async helperSignup(@Body() dto: HelperSignupDto, @UploadedFiles() files: {profileImage: Express.Multer.File[]; certificate: Express.Multer.File[]}){
        return this.userService.helperSign(dto, files);
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
    @ApiResponse({type: UserIdDto})
    async matchAdmin(@Query('userId') userId: number){
        if(!userId){
            return;
        }
        return this.userService.getMatchAdmin(userId);
    }
}