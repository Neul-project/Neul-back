import { ApiProperty } from '@nestjs/swagger';

export class ExitRoomDto {
  @ApiProperty({ example: 5, description: '채팅방 ID' })
  roomId: number;

  @ApiProperty({
    example: 'user',
    description: '삭제하는 사용자',
    enum: ['user', 'admin'],
  })
  type: 'user' | 'admin';
}
