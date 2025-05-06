import { ApiProperty } from '@nestjs/swagger';
import { ActivityInfoDto } from '../activity-info.dto';

export class SelectFeedbackDto {
    @ApiProperty({ example: 1, description: '피드백 ID' })
    id: number;
  
    @ApiProperty({ example: '오늘 활동 감사합니다.', description: '피드백 메시지' })
    message: string;
  
    @ApiProperty({ example: '2024-01-01T13:00:00.000Z', description: '피드백 작성일' })
    recorded_at: Date;
  
    @ApiProperty({ type: ActivityInfoDto, description: '활동 정보' })
    activity: ActivityInfoDto;
}