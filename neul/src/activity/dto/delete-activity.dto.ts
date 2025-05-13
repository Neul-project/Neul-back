import { ApiProperty } from '@nestjs/swagger';

export class DeleteActivityDto {
  @ApiProperty({example: [1, 2, 3], description: '삭제할 활동기록 ID 배열'})
  ids: number[];
}