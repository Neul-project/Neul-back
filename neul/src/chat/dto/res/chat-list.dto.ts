import { ApiProperty } from '@nestjs/swagger';
import { UserInfoAllDto } from 'src/helper/dto/res/user-info-all.dto';

export class ChatListDTO {
  @ApiProperty({ example: 2, description: '채팅 ID' })
  id: number;

  @ApiProperty({ example: '안녕하세요?', description: '채팅 메시지 내용' })
  message: string;

  @ApiProperty({ example: '2025-05-07T09:34:50.603Z', description: '채팅 작성 시간' })
  created_at: string;

  @ApiProperty({ type: UserInfoAllDto, description: '사용자 정보' })
  user: UserInfoAllDto;

  @ApiProperty({ type: UserInfoAllDto, description: '관리자 정보' })
  admin: UserInfoAllDto;
}