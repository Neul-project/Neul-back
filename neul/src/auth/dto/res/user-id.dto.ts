import { ApiProperty } from '@nestjs/swagger';
export class UserIdDto {
  @ApiProperty({ description: '유저 ID', example: 42 })
  userId: number;
}