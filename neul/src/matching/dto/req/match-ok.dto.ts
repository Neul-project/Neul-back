import { ApiProperty } from '@nestjs/swagger';

export class MatchOKDto {
  @ApiProperty({ example: 3, description: '매칭할 관리자 ID' })
  adminId: number;

  @ApiProperty({ example: 7, description: '보호자(유저) ID' })
  userId: number;
}