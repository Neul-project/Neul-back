import { ApiProperty } from '@nestjs/swagger';

export class ChatRoomListDto {
  @ApiProperty({ example: 1, description: '채팅방 고유 ID' })
  id: number;

  @ApiProperty({ example: 10, description: '보호자 유저 ID' })
  userId: number;

  @ApiProperty({ example: '홍길동', description: '보호자 이름' })
  userName: string;

  @ApiProperty({ example: '김철수', description: '피보호자 이름' })
  patientName: string;

  @ApiProperty({ example: '안녕하세요', description: '마지막 채팅 메시지' })
  lastMessage: string;

  @ApiProperty({ example: '2025-05-07T10:30:00.000Z', description: '마지막 채팅 시간' })
  lastTime: string;

  @ApiProperty({ example: 3, description: '안 읽은 메시지 수' })
  unreadCount: number;
}
