import { ApiProperty } from '@nestjs/swagger';
import { UserInfoAllDto } from 'src/helper/dto/res/user-info-all.dto';
import { ContectPatientDto } from 'src/status/dto/res/contect-patient.dto';

export class SelectActivityDto {
  @ApiProperty({ example: 12, description: '활동기록 ID' })
  id: number;

  @ApiProperty({ example: '산책', description: '활동 제목' })
  title: string;

  @ApiProperty({ example: 'activity1.jpg', description: '활동 이미지', nullable: true })
  img?: string;

  @ApiProperty({ example: '야외활동', description: '활동 타입' })
  type: string;

  @ApiProperty({ example: 'yes', description: '재활치료 여부', enum: ['yes', 'no', 'none'] })
  rehabilitation: string;

  @ApiProperty({ example: '다리 통증이 있어 오래 걷지 못함', description: '특이사항', nullable: true })
  note?: string;

  @ApiProperty({ example: '2025-05-01T15:30:00.000Z', description: '기록 일시' })
  recorded_at: Date;

  @ApiProperty({ type: ContectPatientDto, description: '피보호자 정보' })
  patient: ContectPatientDto;

  @ApiProperty({ type: UserInfoAllDto, description: '도우미(관리자) 정보' })
  admin?: UserInfoAllDto;
}