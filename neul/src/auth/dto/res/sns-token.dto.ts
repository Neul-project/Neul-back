import { ApiProperty } from '@nestjs/swagger';

export class SnsTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'SNS Access Token (로그인 후 프론트에서 사용할 토큰)' })
  snsAccess: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'SNS Refresh Token (재발급용)' })
  snsRefresh: string;
}