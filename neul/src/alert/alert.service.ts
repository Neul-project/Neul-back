import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from 'entities/alert';
import { Repository } from 'typeorm';

@Injectable()
export class AlertService {
    constructor(
        @InjectRepository(Alert)
        private alertRepository: Repository<Alert>,
    ) {}

    // 알림 전체 전달
    async getAlarmAll(){
        const alarm = await this.alertRepository.find({
            select: ['id', 'message', 'isChecked', 'created_at']
        });

        return alarm;
    }
}
