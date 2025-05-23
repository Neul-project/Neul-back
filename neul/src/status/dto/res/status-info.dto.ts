import { ApiProperty } from '@nestjs/swagger';

export class StatusInfoDto {
  @ApiProperty({ example: 2, description: '기록 작성 관리자 ID' })
  id: number;

  @ApiProperty({ example: '완식, 대부분 섭취, 식사 거부', description: '식사량' })
  meal: string;

  @ApiProperty({ example: '좋음', description: '컨디션' })
  condition: string;

  @ApiProperty({ example: 'yes', description: '약 복용 여부', enum: ['yes', 'no', 'none'] })
  medication: string;

  @ApiProperty({ example: '13시간', description: '수면 시간' })
  sleep: string;

  @ApiProperty({ example: '경미함', description: '통증 여부' })
  pain: string;

  @ApiProperty({ example: '조금 힘들어함', description: '특이사항' })
  note?: string;
}