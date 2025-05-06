import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { CreateActivityDto } from './dto/create-activity.dto';
import { diskStorage } from 'multer';
import { ListActivityDto } from './dto/res/list-activity.dto';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '@nestjs/swagger';
import { ContectPatientDto } from 'src/status/dto/res/contect-patient.dto';
import { SelectActivityDto } from './dto/res/select-activity.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AllFeedbackDto } from './dto/res/all-feedback.dto';

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
    async listActivity(@Param('userid') userid: number){
        const list = await this.activityService.listAct(userid);

        return plainToInstance(ListActivityDto, list);
    }

    // 담당 피보호자 목록
    @Get('/targetlist')
    @ApiResponse({type: ContectPatientDto})
    async targetPatient(@Query('adminId') adminId: number){
        return this.activityService.targetPat(adminId);
    }

    // 선택한 피보호자 활동기록 전달
    @Get('/selectlist')
    @ApiResponse({type: SelectActivityDto})
    async selectList(@Query('adminId') adminId: number, @Query('patientId') patientId: number){
        return this.activityService.selectList(adminId, patientId);
    }

    // 피드백 저장
    @Post('/feedback')
    async postFeedback(@Body() dto: CreateFeedbackDto){
        return this.activityService.postFeed(dto);
    }

    // 전체 피드백 전달
    @Get('/feedback/views')
    @ApiResponse({type: AllFeedbackDto})
    async allFeedback(){
        return this.activityService.allFeed();
    }

    // 관리자 별 피드백 전달
    @Get('/feedback/view')
    @ApiResponse({type: SelectActivityDto})
    async selectFeedback(@Query('adminId') adminId: number){
        return this.activityService.selectFeed(adminId);
    }
}

