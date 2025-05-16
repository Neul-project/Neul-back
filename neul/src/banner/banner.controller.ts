import { Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { BannerService } from './banner.service';
import { diskStorage } from 'multer';
import { join } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';
import { BannerListDto } from './dto/res/banner-list.dto';

@Controller('banner')
export class BannerController {
    constructor (private readonly bannerService: BannerService) {}

    // 배너 등록
    @Post('/registration')
    @UseInterceptors(
        FilesInterceptor('img', 2, {
          storage: diskStorage({
            destination: join(process.cwd(), 'uploads/image'),
            filename: (req, file, callback) => {
              const filename = `${file.originalname}`;
              callback(null, filename);
            },
          }),
        }),
      )
    async bannerRegister(@UploadedFiles() files: Express.Multer.File[]){
      return await this.bannerService.bannerRegi(files);
    }

    // 배너 전달
    @Get('/list')
    @ApiResponse({type: BannerListDto})
    async BannerList(){
      return await this.bannerService.bannerList();
    }
}
