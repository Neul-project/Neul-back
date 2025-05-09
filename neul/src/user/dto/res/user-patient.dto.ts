import { ApiProperty } from '@nestjs/swagger';

export class PatientInfoDto {
  @ApiProperty({ example: 1, description: '환자 ID' })
  patient_id: number | null;

  @ApiProperty({ example: '홍길동', description: '환자 이름' })
  patient_name: string;

  @ApiProperty({ example: '남성', description: '환자 성별' })
  patient_gender: string;

  @ApiProperty({ example: '1990-01-01', description: '환자 생년월일' })
  patient_birth: string;

  @ApiProperty({ example: '고혈압 있음', description: '환자 특이사항' })
  patient_note: string;
}

export class UserPatientDto {
  @ApiProperty({ example: 1, description: '유저 ID' })
  id: number;

  @ApiProperty({ example: 'test@example.com', description: '이메일' })
  email: string;

  @ApiProperty({ example: '홍길동', description: '이름' })
  name: string;

  @ApiProperty({ example: '01012345678', description: '전화번호' })
  phone: string;

  @ApiProperty({ type: PatientInfoDto })
  patient: PatientInfoDto;
}
