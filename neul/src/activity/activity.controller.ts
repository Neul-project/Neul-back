import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { CreateActivityDto } from './dto/create-activity.dto';
import { diskStorage } from 'multer';
import { ListActivityDto } from './dto/res/listActivity.dto';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '@nestjs/swagger';

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
    async writeActivity(@Param('userid') userid: number, @Body() dto: CreateActivityDto, @UploadedFiles() files: Express.Multer.File[]){
        return await this.activityService.writeAct(userid, dto, files);
    }

    // 활동기록 제공
    @Get('list/:userid')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({type: ListActivityDto})
    async listActivity(@Param('userid') userid: number): Promise<ListActivityDto[]>{
        const list = await this.activityService.listAct(userid);

        return plainToInstance(ListActivityDto, list);
    }
}

