import { ApiProperty } from '@nestjs/swagger';

export class SingupUserDto {
  @ApiProperty({ example: 'test@example.com', description: '이메일' })
  email: string;

  @ApiProperty({ example: 'securepassword123', description: '비밀번호' })
  password: string;

  @ApiProperty({ example: '홍길동', description: '이름'})
  name: string;

  @ApiProperty({ example: '01012345678', description: '전화번호'})
  phone: string;

  @ApiProperty({ example: 'user', enum: ['user', 'admin'], description: '사용자 역할'})
  role: string;
}
