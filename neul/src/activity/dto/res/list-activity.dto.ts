import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListActivityDto {
  @ApiProperty({ example: 1, description: '활동 ID' })
  id: number;

  @ApiProperty({ example: '5/1 활동기록', description: '활동 제목' })
  title: string;

  @ApiProperty({ example: '2025-05-01', description: '기록 날짜 (YYYY-MM-DD)' })
  @Transform(({ value }) => new Date(value).toISOString().split('T')[0])
  recorded_at: string;
}