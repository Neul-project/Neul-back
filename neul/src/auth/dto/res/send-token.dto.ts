import { ApiProperty } from '@nestjs/swagger';

export class SendTokenDto {
  @ApiProperty({ example: { id: 1, email: 'user@example.com' }, description: 'JWT payload에 담긴 사용자 정보' })
  user: { id: number; email: string; };

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: '발급된 JWT 토큰' })
  token: string;
}
