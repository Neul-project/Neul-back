import { ApiProperty } from '@nestjs/swagger';

export class DeleteStatusDto {
  @ApiProperty({example: [1, 2, 3], description: '삭제할 상태기록/활동기록/프로그램 ID 배열'})
  ids: number[];
}