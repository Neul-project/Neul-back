import { ApiPropertyOptional } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiPropertyOptional({ example: 'user@example.com', description: '이메일 주소' })
  email?: string;
}