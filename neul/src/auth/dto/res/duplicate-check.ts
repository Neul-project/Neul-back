import { ApiProperty } from '@nestjs/swagger';

export class DuplicateCheckDto {
  @ApiProperty({ example: true, description: '중복 여부' })
  isDuplicate: boolean;
}
