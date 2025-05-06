import { ApiProperty } from '@nestjs/swagger';

export class AddUserDto {
  @ApiProperty({ example: '홍길동', description: '보호자 이름' })
  name: string;

  @ApiProperty({ example: '01012345678', description: '보호자 전화번호' })
  phone: string;

  @ApiProperty({ example: '서울특별시 강남구 테헤란로 123', description: '보호자 주소' })
  address: string;
}
