import { ApiProperty } from '@nestjs/swagger';

export class CartDeleteDto {
  @ApiProperty({ example: [1, 2], description: '프로그램 ID 목록' })
  programIds: number[];
}
