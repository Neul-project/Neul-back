import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WardDto {
  @ApiProperty({ example: '김영희', description: '환자 이름' })
  name: string;

  @ApiProperty({ example: 'female', description: '환자 성별' })
  gender: string;

  @ApiProperty({ example: '1996-01-01', description: '환자 생년월일' })
  birth: string;

  @ApiProperty({ example: '특이사항으로는 무엇이 있습니다.', description: '환자에 대한 특이사항' })
  note: string;
}

export class PatientInfoDto {
  @ApiProperty({ example: '홍길동', description: '보호자 이름' })
  name: string;

  @ApiProperty({ example: 'abcd@abcd.com', description: '보호자 이메일' })
  email: string;

  @ApiProperty({ example: '010-1111-1111', description: '보호자 핸드폰 번호' })
  phone: string;

  @ApiProperty({ example: '서울시 강남구', description: '보호자 주소' })
  address: string;

  @ApiProperty({ example: 'user', description: '역할' })
  role: string;

  @ApiPropertyOptional({ type: WardDto, description: '보호자가 등록한 환자 정보' })
  ward?: WardDto | null;
}
