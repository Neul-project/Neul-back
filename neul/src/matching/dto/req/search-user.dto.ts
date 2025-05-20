import { ApiProperty } from '@nestjs/swagger';

export class SearchUserDto {
  @ApiProperty({
    example: 'user_id',
    description: '검색 기준',
    enum: ['user_id', 'user_name', 'patient_name'],
  })
  search: string;

  @ApiProperty({ example: '홍길동', description: '검색어 (이름 또는 ID 일부)' })
  word: string;
}
