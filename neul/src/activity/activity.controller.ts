import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { CreateActivityDto } from './dto/create-activity.dto';
import { diskStorage } from 'multer';
import { ListActivityDto } from './dto/res/list-activity.dto';
import { plainToInstance } from 'class-transformer';
import { ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { ContectPatientDto } from 'src/status/dto/res/contect-patient.dto';
import { SelectActivityDto } from './dto/res/select-activity.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AllFeedbackDto } from './dto/res/all-feedback.dto';
import { DeleteStatusDto } from 'src/status/dto/delete-status.dto';
import { UpdateActivityDto } from './dto/res/update-activity.dto';

@Controller('activity')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    // 활동기록 등록
    @Post('write/:userid')
    @UseInterceptors(
        FilesInterceptor('img', 5, {
            storage: diskStorage({
                destination: join(process.cwd(), 'uploads'),
                filename: (req, file, callback) => {
                    const filename = `${file.originalname}`;
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
                destination: join(process.cwd(), 'uploads'),
                filename: (req, file, callback) => {
                    const filename = `${file.originalname}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    async updateActivity(@Param('activityId') activityId: number, @Body() dto: UpdateActivityDto, @UploadedFiles() files: Express.Multer.File[]){
        return await this.activityService.updateAct(activityId, dto, files);
    }

    // 활동기록 제공 (사용자)
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

    // 전체 활동기록 전달 (관리자)
    @Get('/selectlistall')
    @ApiResponse({type: SelectActivityDto})
    async allListActivity(@Query('adminId') adminId: number){
        return this.activityService.getAllListAct(adminId);
    }

    // 해당 활동기록 정보 전달 (사용자)
    @Get('/detail')
    @ApiResponse({type: SelectActivityDto})
    async detailActivity(@Query('userId') userId: number, @Query('id') id: number){
        return this.activityService.detailAct(userId, id);
    }

    // 선택한 활동기록 삭제 (사용자)
    @Delete('/delete')
    async listDelete(@Body() dto: DeleteStatusDto){
        return this.activityService.listDelAct(dto.ids);
    }

    // 피드백 저장
    @Post('/feedback')
    async postFeedback(@Body() body){
        console.log(body, '오디오는어떻게');
    }
    // async postFeedback(@Body() dto: CreateFeedbackDto){
    //     return this.activityService.postFeed(dto);
    // }

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

