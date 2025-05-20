import { ApiProperty } from '@nestjs/swagger';

export class MatchUserDto {
  @ApiProperty({ example: 3, description: '매칭할 관리자 ID' })
  adminId: number;

  @ApiProperty({ example: 7, description: '보호자(유저) ID' })
  userId: number;

  @ApiProperty({ example: 12, description: '피보호자(patient) ID' })
  patientId: number;
}
