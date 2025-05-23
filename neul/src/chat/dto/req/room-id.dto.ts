import { ApiProperty } from '@nestjs/swagger';

export class RoomIdDto {
  @ApiProperty({ example: 10, description: '채팅방 ID' })
  roomId: number;
}
