import { ApiProperty } from '@nestjs/swagger';

export class UpdatePWDto {
  @ApiProperty({ example: 'user@example.com', description: '이메일 주소' })
  email: string;

  @ApiProperty({ example: 'newSecurePassword123!', description: '새 비밀번호' })
  newPassword: string;
}