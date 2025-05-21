import { ApiProperty } from '@nestjs/swagger';

export class UserIdsDto {
  @ApiProperty({ example: [1, 2], description: '사용자 ID 목록' })
  ids: number[];
}