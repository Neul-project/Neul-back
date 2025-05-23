import { ApiProperty } from '@nestjs/swagger';

export class ScheduleDto {
  @ApiProperty({ example: 1, description: '신청 ID (apply PK)' })
  id: number;

  @ApiProperty({ example: 10, description: '보호자 ID' })
  userId: number;

  @ApiProperty({ example: '김선', description: '보호자 이름' })
  userName: string;

  @ApiProperty({ example: '01012345678', description: '보호자 전화번호' })
  phone: string;

  @ApiProperty({ example: 20, description: '피보호자 ID' })
  patientId: number;

  @ApiProperty({ example: '이수', description: '피보호자 이름' })
  patientName: string;

  @ApiProperty({ example: '2025-05-21,2025-05-23', description: '신청된 가능 날짜들' })
  availableDate: string;
}
