import { ApiProperty } from '@nestjs/swagger';

export class AlertInfoDto {
  @ApiProperty({ example: 1, description: '알림 ID' })
  id: number;

  @ApiProperty({ example: 'match', description: '알림 메시지 타입' })
  message: string;

  @ApiProperty({ example: false, description: '알림 확인 여부' })
  isChecked: boolean;

  @ApiProperty({ example: '2025-05-20T15:00:00.000Z', description: '알림 생성 일시' })
  created_at: Date;

  @ApiProperty({ example: '개인사정으로인해 반려합니다.', description: '반려 이유' })
  reason: string;
}
