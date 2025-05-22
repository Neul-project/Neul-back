import { ApiProperty } from '@nestjs/swagger';

export class MatchSubmitDto {
  @ApiProperty({ example: 3, description: '매칭할 관리자 ID' })
  helperId: number;

  @ApiProperty({ example: ['2025-05-19', '2025-05-20', '2025-05-21'], description: '매칭 신청 날짜들' })
  dates: string[];
}