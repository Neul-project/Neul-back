import { ApiPropertyOptional } from '@nestjs/swagger';

export class HelperQueryDto {
  @ApiPropertyOptional({ description: '상태 필터: wait, approve, reject', example: 'approve' })
  type?: string;

  @ApiPropertyOptional({ description: '검색할 값', example: '10' })
  search?: string;

  @ApiPropertyOptional({ description: '검색 필드: id | name', example: 'id' })
  search_value?: 'id' | 'name';
}
