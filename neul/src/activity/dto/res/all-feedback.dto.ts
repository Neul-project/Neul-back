import { ApiProperty } from '@nestjs/swagger';
import { ActivityInfoDto } from '../req/activity-info.dto';

export class AllFeedbackDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '감사합니다.', description: '음성/텍스트 메시지' })
  message: string;

  @ApiProperty({ example: '2025-05-06T12:00:00Z', description: '작성 시간' })
  recorded_at: Date;

  @ApiProperty({ type: ActivityInfoDto, description: '활동 정보' })
  activity: ActivityInfoDto;
}
