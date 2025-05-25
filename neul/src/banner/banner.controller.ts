import { Body, Controller, Delete, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { BannerService } from './banner.service';
import { diskStorage } from 'multer';
import { join } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';
import { BannerListDto } from './dto/res/banner-list.dto';
import { BannerRegisterDto } from './dto/req/banner-register.dto';

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
              const filename = `${Date.now()}_${file.originalname}`;
              callback(null, filename);
            },
          }),
        }),
      )
    async bannerRegister(@Body() dto: BannerRegisterDto, @UploadedFiles() files: Express.Multer.File[]){
      return await this.bannerService.bannerRegi(dto, files);
    }

    // 배너 삭제
    @Delete('/delete')
    async bannerDelete(@Body() dto){
      return await this.bannerService.bannerDel(dto.id);
    }

    // 배너 전달
    @Get('/list')
    @ApiResponse({type: BannerListDto})
    async bannerList(){
      return await this.bannerService.bannerList();
    }
}
