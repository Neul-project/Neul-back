import { ApiProperty } from '@nestjs/swagger';

export class DeleteIdsDto {
  @ApiProperty({example: [1, 2, 3], description: '삭제할 ID 배열'})
  ids: number[];
} 