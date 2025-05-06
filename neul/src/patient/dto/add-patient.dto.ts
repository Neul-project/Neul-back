import { ApiProperty } from '@nestjs/swagger';

export class AddPatientDto {
  @ApiProperty({ example: '김보호', description: '피보호자 이름' })
  name: string;

  @ApiProperty({ example: 'male', enum: ['male', 'female'], description: '성별' })
  gender: string;

  @ApiProperty({ example: '1945-06-01', description: '생년월일 (YYYY-MM-DD)' })
  birth: string;

  @ApiProperty({ example: '치매 초기 진단 받음', description: '비고사항' })
  note?: string;
}
