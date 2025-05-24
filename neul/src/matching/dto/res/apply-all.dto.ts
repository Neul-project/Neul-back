import { ApiProperty } from '@nestjs/swagger';

export class ApplyAllDto {
  @ApiProperty({ example: 1, description: '신청 ID' })
  id: number;

  @ApiProperty({ example: 25, description: '유저 ID' })
  user: number;

  @ApiProperty({ example: 20, description: '신청한 도우미 ID' })
  admin: number;

  @ApiProperty({ example: '2025-06-01,2025-06-03', description: '신청 날짜 목록'})
  dates: string;

  @ApiProperty({ example: '승인 대기', description: '신청 상태' })
  status: string;

  @ApiProperty({ example: '2025-05-20T12:34:56.000Z', description: '신청 시간' })
  created_at: Date;
}