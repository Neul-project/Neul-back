import { ApiProperty } from '@nestjs/swagger';

export class UpdatePWDto {
  @ApiProperty({ example: 'newSecurePassword123!', description: '새 비밀번호' })
  newPassword: string;
}