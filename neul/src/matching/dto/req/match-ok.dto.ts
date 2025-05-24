import { ApiProperty } from '@nestjs/swagger';
export class MatchOKDto {
  @ApiProperty({ example: 1, description: '매칭 신청 ID' })
  applyId: number;

  @ApiProperty({ example: 3, description: '매칭할 관리자 ID' })
  adminId: number;

  @ApiProperty({ example: 7, description: '보호자(유저) ID' })
  userId: number;
}