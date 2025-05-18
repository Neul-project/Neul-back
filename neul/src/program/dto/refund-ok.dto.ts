import { ApiProperty } from '@nestjs/swagger';

export class RefundOKDto {
  @ApiProperty({ example: 1, description: '프로그램 ID' })
  id: number;
}