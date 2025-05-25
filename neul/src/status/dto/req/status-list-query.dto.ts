import { ApiPropertyOptional } from '@nestjs/swagger';

export class StatusListQueryDto {
  @ApiPropertyOptional({ description: '관리자 ID (adminId)', example: 1 })
  adminId?: number;

  @ApiPropertyOptional({ description: '피보호자 ID (patientId)', example: 5 })
  patientId?: number;

  @ApiPropertyOptional({ description: '유저 ID (userId)', example: 10 })
  userId?: number;

  @ApiPropertyOptional({ description: '기록 조회 날짜 (YYYY-MM-DD)', example: '2025-05-25' })
  date?: string;
}
