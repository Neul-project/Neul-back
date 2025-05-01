import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({ description: '활동 제목', example: '5/1 활동기록' })
  title: string;

  @ApiProperty({ description: '활동 타입', example: 'walk' })
  type: string;

  @ApiProperty({ description: '재활치료 여부', example: 'none', enum: ['yes', 'no', 'none'] })
  rehabilitation: string;

  @ApiProperty({ description: '특이사항', example: '조금 힘들어함'})
  note?: string;

  @ApiProperty({ description: '환자 ID', example: '1' })
  patient_id: string;
}
