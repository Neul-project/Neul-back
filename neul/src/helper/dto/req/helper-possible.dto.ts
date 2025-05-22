import { ApiProperty } from '@nestjs/swagger';

export class HelperPossibleDto {
  @ApiProperty({ example: '2025-05-22', description: '가능 시작 날짜' })
  startDate: string;

  @ApiProperty({ example: '2025-05-31', description: '가능 종료 날짜' })
  endDate: string;

  @ApiProperty({ example: ['thu', 'fri'], description: '가능한 요일 목록' })
  week: string[];
}