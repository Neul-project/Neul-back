import { ApiProperty } from '@nestjs/swagger';

export class DeleteMatchDto {
  @ApiProperty({ example: 2, description: '신청 ID' })
  id: number;

  @ApiProperty({ example: 8, description: '사용자 id' })
  userId: number;

  @ApiProperty({ example: 3, description: '도우미 id' })
  adminId: number;
}
