import { ApiProperty } from '@nestjs/swagger';

export class UsersIdDto {
  @ApiProperty({ example: 10, description: '보호자 유저 ID' })
  userId: number;

  @ApiProperty({ example: 19, description: '관리자 유저 ID' })
  adminId: number;
}
