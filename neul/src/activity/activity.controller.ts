import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { CreateActivityDto } from './dto/req/create-activity.dto';
import { diskStorage } from 'multer';
import { ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { SelectActivityDto } from './dto/res/select-activity.dto';
import { CreateFeedbackDto } from './dto/req/create-feedback.dto';
import { AllFeedbackDto } from './dto/res/all-feedback.dto';
import { DeleteStatusDto } from 'src/status/dto/req/delete-status.dto';
import { UpdateActivityDto } from './dto/req/update-activity.dto';
import { ActivityPatientQueryDto } from './dto/req/activity-patient-query.dto';
import { FeedbackQueryDto } from './dto/req/feedback-query.dto';

@Controller('activity')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    // 활동기록 등록
    @Post('write/:userid')
    @UseInterceptors(
        FilesInterceptor('img', 5, {
            storage: diskStorage({
                destination: join(process.cwd(), 'uploads/image'),
                filename: (req, file, callback) => {
                    const filename = `${Date.now()}_${file.originalname}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    @ApiConsumes('multipart/form-data')
    async writeActivity(@Param('userid') userid: number, @Body() dto: CreateActivityDto, @UploadedFiles() files: Express.Multer.File[]){
        return await this.activityService.writeAct(userid, dto, files);
    }

    // 활동기록 수정
    @Patch('/update/:activityId')
    @UseInterceptors(
        FilesInterceptor('img', 5, {
            storage: diskStorage({
                destination: join(process.cwd(), 'uploads/image'),
                filename: (req, file, callback) => {
                    const filename = `${Date.now()}_${file.originalname}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    async updateActivity(@Param('activityId') activityId: number, @Body() dto: UpdateActivityDto, @UploadedFiles() files: Express.Multer.File[]){
        return await this.activityService.updateAct(activityId, dto, files);
    }

    // 담당 피보호자 목록
    // @Get('/targetlist')
    // @ApiResponse({type: ContectPatientDto})
    // async targetPatient(@Query('adminId') adminId: number){
    //     return this.activityService.targetPat(adminId);
    // }

    // 피보호자 활동기록 전달
    @Get('/selectlist')
    @ApiResponse({type: SelectActivityDto})
    async selectList(@Query() query: ActivityPatientQueryDto){
        console.log(query, '받앗나')
        return this.activityService.selectList(query);
    }

    // 선택한 활동기록 삭제 (사용자)
    @Delete('/delete')
    async listDelete(@Body() dto: DeleteStatusDto){
        return this.activityService.listDelAct(dto.ids);
    }

    // 피드백 저장
    @Post('/feedback')
    async postFeedback(@Body() dto: CreateFeedbackDto){
        return this.activityService.postFeed(dto);
    }

    // 관리자 별 피드백 전달
    @Get('/feedback/view')
    @ApiResponse({type: AllFeedbackDto})
    async selectFeedback(@Query() query: FeedbackQueryDto){
        return this.activityService.selectFeed(query);
    }
}