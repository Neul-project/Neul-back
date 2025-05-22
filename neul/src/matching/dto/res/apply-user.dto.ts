import { ApiProperty } from '@nestjs/swagger';

export class ApplyUserDto {
  @ApiProperty({ example: '결제 대기', description: '매칭 상태' })
  status: string;

  @ApiProperty({ example: '2025-05-22T10:30:00.000Z', description: '신청 일시' })
  created_at: Date;

  @ApiProperty({ example: 25, description: '신청한 유저 ID' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: '신청한 유저 이메일' })
  email: string;

  @ApiProperty({ example: '홍길동', description: '신청한 유저 이름' })
  name: string;

  @ApiProperty({ example: '01012345678', description: '신청한 유저 연락처' })
  phone: string;

  @ApiProperty({ example: ['2025-06-01', '2025-06-05'], description: '신청 날짜 목록' })
  dates: string[];

  @ApiProperty({ example: 11, description: '가족 환자 ID' })
  patient_id: number;

  @ApiProperty({ example: '김철수', description: '가족 환자 이름' })
  patient_name: string;

  @ApiProperty({ example: '남성', description: '가족 환자 성별' })
  patient_gender: string;

  @ApiProperty({ example: '1950-03-10', description: '가족 환자 생년월일' })
  patient_birth: string;

  @ApiProperty({ example: '치매 초기 증상 있음', description: '가족 환자 비고' })
  patient_note: string;
}
