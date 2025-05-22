import { ApiProperty } from '@nestjs/swagger';

export class LoginMeDto {
  @ApiProperty({ example: 1, description: '사용자 ID' })
  id: number;

  @ApiProperty({ example: '홍길동', description: '사용자 이름' })
  name: string;

  @ApiProperty({ example: 'local', description: '가입 경로' })
  provider: string;

  @ApiProperty({ example: 'user', description: '역할'})
  role: string;
}