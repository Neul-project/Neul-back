import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AlertService } from './alert.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { AlertInfoDto } from './dto/res/alert-info.dto';

@Controller('alert')
export class AlertController {
    constructor (private readonly alertService: AlertService) {}

    // 알림 전체 전달
    @Get('/alarm')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({type: AlertInfoDto})
    async alarmAll(@Req() req){
        const userId = req.user.id;
        return await this.alertService.getAlarmAll(userId);
    }

    // 알림 체크 완료
    @Patch('/checkAll')
    @UseGuards(JwtAuthGuard)
    async checkAll(@Req() req){
        const userId = req.user.id;
        return await this.alertService.checkAll(userId);
    }
}