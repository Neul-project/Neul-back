import { ApiProperty } from '@nestjs/swagger';

export class CreateStatusDto {
  @ApiProperty({ example: 1, description: '환자 ID' })
  patient_id: number;

  @ApiProperty({ example: 1, description: '기록 작성 관리자 ID' })
  adminId: number;

  @ApiProperty({ example: ['완식', '대부분 섭취', '식사 거부'] })
  meal: string[];

  @ApiProperty({ example: '아주 좋음', description: '컨디션' })
  condition: string;

  @ApiProperty({ example: 'none', description: '식사량', enum: ['yes', 'no', 'none'] })
  medication: string;

  @ApiProperty({ example: '13시간', description: '수면 시간' })
  sleep: string;

  @ApiProperty({ example: '경미함', description: '통증 여부' })
  pain: string;

  @ApiProperty({ example: '조금 힘들어함', description: '특이사항' })
  note?: string;
}
