import { ApiProperty } from '@nestjs/swagger';

export class FindEmailDto {
  @ApiProperty({ example: '홍길동', description: '사용자 이름' })
  name: string;

  @ApiProperty({ example: '01012345678', description: '휴대폰 번호' })
  phone: string;
}