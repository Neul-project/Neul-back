import { Controller, Get } from '@nestjs/common';
import { AlertService } from './alert.service';

@Controller('alert')
export class AlertController {
    constructor (private readonly alertService: AlertService) {}

    // 알림 전체 전달
    @Get('/alarm')
    async alarmAll(){
        return await this.alertService.getAlarmAll();
    }
}
