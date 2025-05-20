import { ApiProperty } from '@nestjs/swagger';

export class ActivityInfoDto {
  @ApiProperty({ example: 3, description: '활동 ID' })
  id: number;

  @ApiProperty({ example: '5/1 활동기록', description: '활동 제목' })
  title: string;

  @ApiProperty({ example: 'image.jpg', description: '활동 이미지' })
  img?: string;

  @ApiProperty({ example: 'walk', description: '활동 타입' })
  type: string;

  @ApiProperty({ example: 'no', description: '재활치료 여부', enum: ['yes', 'no', 'none'] })
  rehabilitation: string;

  @ApiProperty({ example: '비가 와서 짧게 진행', description: '활동 특이사항' })
  note?: string;

  @ApiProperty({ example: '2024-01-01T12:00:00.000Z', description: '활동 기록일' })
  recorded_at: Date;
}