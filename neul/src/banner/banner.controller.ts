import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { BannerService } from './banner.service';
import { diskStorage } from 'multer';
import { join } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('banner')
export class BannerController {
    constructor (private readonly bannerService: BannerService) {}

    // 배너 등록
    @Post('/registration')
    @UseInterceptors(
        FilesInterceptor('img', 2, {
          storage: diskStorage({
            destination: join(process.cwd(), 'uploads'),
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
}
