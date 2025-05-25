import { ApiPropertyOptional } from '@nestjs/swagger';

export class FeedbackQueryDto {
  @ApiPropertyOptional({ description: '관리자 ID', example: 1 })
  adminId?: number;

  @ApiPropertyOptional({ description: '검색어', example: '산책' })
  search?: string;
}