import { ApiPropertyOptional } from '@nestjs/swagger';

export class CheckDuplicateDto {
  @ApiPropertyOptional({ example: 'test@example.com', description: '이메일' })
  email?: string;

  @ApiPropertyOptional({ example: '01012345678', description: '전화번호' })
  phone?: string;
}
