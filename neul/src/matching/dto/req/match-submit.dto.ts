import { ApiProperty } from '@nestjs/swagger';

export class MatchSubmitDto {
  @ApiProperty({ example: 3, description: '매칭할 관리자 ID' })
  helperId: number;

  @ApiProperty({ example: '2025-05-19', description: '시작할 날짜' })
  startDate: string;

  @ApiProperty({ example: '2025-05-25', description: '끝나는 날짜' })
  endDate: string;
}