import { ApiProperty } from '@nestjs/swagger';
import { ContectPatientDto } from 'src/status/dto/res/contect-patient.dto';
import { AdminInfoDto } from 'src/status/dto/admin-info.dto';

export class SelectActivityDto {
  @ApiProperty({ example: 12, description: '활동 ID' })
  id: number;

  @ApiProperty({ type: ContectPatientDto, description: '피보호자 정보' })
  patient: ContectPatientDto;

  @ApiProperty({ example: '산책', description: '활동 제목' })
  title: string;

  @ApiProperty({ example: 'activity1.jpg', description: '활동 이미지 URL', nullable: true })
  img?: string;

  @ApiProperty({ example: '야외활동', description: '활동 타입' })
  type: string;

  @ApiProperty({ example: 'yes', description: '재활치료 여부', enum: ['yes', 'no', 'none'] })
  rehabilitation: string;

  @ApiProperty({ example: '다리 통증이 있어 오래 걷지 못함', description: '특이사항', nullable: true })
  note?: string;

  @ApiProperty({ example: '2025-05-01T15:30:00.000Z', description: '기록 일시' })
  recorded_at: Date;
}
