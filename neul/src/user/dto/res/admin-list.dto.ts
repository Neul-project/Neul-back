import { ApiProperty } from '@nestjs/swagger';

export class AdminListDto {
  @ApiProperty({ example: 3, description: '관리자 ID' })
  value: number;

  @ApiProperty({ example: '홍길동', description: '관리자 이름' })
  label: string;
}
