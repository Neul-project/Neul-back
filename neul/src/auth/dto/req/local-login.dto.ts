import { ApiProperty } from '@nestjs/swagger';

export class LocalLoginDto {
  @ApiProperty({ example: 'user@example.com', description: '이메일' })
  email: string;

  @ApiProperty({ example: 'securePassword123!', description: '비밀번호' })
  password: string;
}