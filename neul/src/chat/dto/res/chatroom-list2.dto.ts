import { ApiProperty } from '@nestjs/swagger';

export class ChatRoomList2Dto {
  @ApiProperty({ example: 5, description: '채팅방 ID' })
  id: number;

  @ApiProperty({ example: 10, description: '도우미 ID' })
  adminId: number;

  @ApiProperty({ example: '홍길동', description: '도우미 이름' })
  adminName: string;

  @ApiProperty({ example: '2025-05-22T14:32:00.000Z', description: '마지막 채팅 시간'})
  lastTime: string;

  @ApiProperty({ example: '안녕하세요', description: '마지막 채팅 메시지' })
  lastMessage: string;

  @ApiProperty({ example: 2, description: '안 읽은 메시지 개수' })
  unreadCount: number;

  @ApiProperty({ example: true, description: '매칭된 상태 여부' })
  isMatched: boolean;

  @ApiProperty({ example: false, description: '사용자가 채팅방을 삭제했는지 여부' })
  roomDel: boolean;
}
