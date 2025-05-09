import { ApiProperty } from '@nestjs/swagger';

export class UserPatientDto {
  @ApiProperty({ example: 3, description: '보호자(유저) ID' })
  user_id: number | null;

  @ApiProperty({ example: '홍길동', description: '보호자(유저) 이름' })
  user_name: string;

  @ApiProperty({ example: 'user@example.com', description: '보호자 이메일' })
  user_email: string;

  @ApiProperty({ example: '010-1234-5678', description: '보호자 연락처' })
  user_phone: string;

  @ApiProperty({ example: '2025-05-07T09:34:50.603Z', description: '보호자 등록 시간' })
  user_create: string;

  @ApiProperty({ example: 1, description: '관리자 ID' })
  admin_id: number | null;

  @ApiProperty({ example: '김관리', description: '관리자 이름' })
  admin_name: string;

  @ApiProperty({ example: 7, description: '환자 ID' })
  patient_id: number;

  @ApiProperty({ example: '이환자', description: '환자 이름' })
  patient_name: string;

  @ApiProperty({ example: '여성', description: '환자 성별' })
  patient_gender: string;

  @ApiProperty({ example: '1945-08-15', description: '환자 생년월일' })
  patient_birth: string;

  @ApiProperty({ example: '치매 초기 증상 있음', description: '환자 특이사항' })
  patient_note: string;
}
