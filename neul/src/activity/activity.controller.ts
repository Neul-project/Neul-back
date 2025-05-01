import { Body, Controller, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { CreateActivityDto } from './dto/create-activity.dto';
import { diskStorage } from 'multer';

@Controller('activity')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    // 활동기록 등록
    @Post('write/:userid')
    @UseInterceptors(
        FilesInterceptor('img', 5, {
            storage: diskStorage({
                destination: join(__dirname, '../../uploads'), // 저장할 경로
                filename: (req, file, callback) => {
                    const filename = `${file.originalname}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    async writeActivity( @Param('userid') userid: string, @Body() dto: CreateActivityDto, @UploadedFiles() files: Express.Multer.File[]){
        return await this.activityService.writeAct(userid, dto, files);
    }
}

