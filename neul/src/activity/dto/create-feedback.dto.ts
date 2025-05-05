import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({ example: '감사합니다.', description: '음성/텍스트 메시지' })
  message: string;

  @ApiProperty({ example: 3, description: '활동 ID' })
  activityid: string;

  @ApiProperty({ example: 1, description: '사용자 ID' })
  userId: number;
}
