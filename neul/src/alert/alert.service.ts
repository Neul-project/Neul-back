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
    async getAlarmAll(userId: number){
        const alarm = await this.alertRepository.find({
            where: {user: {id: userId}},
            select: ['id', 'message', 'isChecked', 'created_at', 'reason']
        });

        return alarm;
    }

    // 알림 체크
    async checkAll(userId: number){
        return await this.alertRepository
            .createQueryBuilder()
            .update()
            .set({ isChecked: true })
            .where('userId = :userId', {userId})
            .execute();
    }
}
