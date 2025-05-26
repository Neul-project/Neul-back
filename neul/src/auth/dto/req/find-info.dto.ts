import { ApiProperty } from '@nestjs/swagger';

export class FindInfoDto {
  @ApiProperty({ example: 'email', description: '아이디 or 비밀번호 찾기' })
  type: string;

  @ApiProperty({ example: '홍길동', description: '사용자 이름' })
  name?: string;

  @ApiProperty({ example: '01012345678', description: '휴대폰 번호' })
  phone?: string;

  @ApiProperty({ example: 'test@example.com', description: '이메일' })
  email?: string;
}