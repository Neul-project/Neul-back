import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { HelperService } from './helper.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { HelperSignupDto } from 'src/user/dto/req/helper-signup.dto';

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
}
