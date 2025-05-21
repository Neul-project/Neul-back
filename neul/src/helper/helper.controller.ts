import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { HelperService } from './helper.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { HelperSignupDto } from 'src/helper/dto/req/helper-signup.dto';
import { ApiResponse } from '@nestjs/swagger';
import { HelperInfoDto } from './dto/res/helper-info.dto';
import { UserIdDto } from 'src/auth/dto/res/user-id.dto';

@Controller('helper')
export class HelperController {
    constructor(private readonly helperService: HelperService) {}

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
        return this.helperService.helperSign(dto, files);
    }

    // 승인대기 도우미 전체 전달
    @Get('/applylist')
    @ApiResponse({type: HelperInfoDto})
    async helperApplyList(){
        return this.helperService.helperApply();
    }

    // 해당 도우미 데이터 전달
    @Get('/userlist')
    @ApiResponse({type: HelperInfoDto})
    async helperOne(@Query('id') id: number){
        return this.helperService.helperOne(id);
    }

    // 정식 도우미 승인
    @Post('/registration')
    async helperYes(@Body() dto: UserIdDto){
        return this.helperService.helperYes(dto.userId);
    }
}
