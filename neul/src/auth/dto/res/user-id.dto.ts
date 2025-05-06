import { ApiProperty } from '@nestjs/swagger';

export class UserIdDto {
  @ApiProperty({ description: '생성된 유저의 ID', example: 42 })
  userId: number;
}