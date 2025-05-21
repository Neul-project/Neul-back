import { ApiProperty } from '@nestjs/swagger';

export class MatchCancelDto {
  @ApiProperty({ example: 3, description: '매칭할 관리자 ID' })
  adminId: number;

  @ApiProperty({ example: 7, description: '보호자(유저) ID' })
  userId: number;

  @ApiProperty({ example: '개인사정으로 반려되었습니다.', description: '반려 사유' })
  content: string;
}