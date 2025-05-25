import { ApiPropertyOptional } from '@nestjs/swagger';

export class ActivityPatientQueryDto {
  @ApiPropertyOptional({ description: '관리자 ID (adminId)', example: 1 })
  adminId?: number;

  @ApiPropertyOptional({ description: '피보호자 ID (patientId)', example: 5 })
  patientId?: number;

  @ApiPropertyOptional({ description: '유저 ID (userId)', example: 10 })
  userId?: number;

  @ApiPropertyOptional({ description: '활동기록 ID (activityId)', example: 7 })
  activityId?: number;
}