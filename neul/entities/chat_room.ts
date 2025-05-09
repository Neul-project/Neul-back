import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Users } from './users';
import { Chats } from './chats';

@Entity('chat_rooms')
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  // 보호자
  @ManyToOne(() => Users, (user) => user.chatRoomUser)
  user: Users;

  // 관리자
  @ManyToOne(() => Users, (user) => user.chatRoomAdmin)
  admin: Users;

  // 채팅 목록
  @OneToMany(() => Chats, (chat) => chat.room)
  chats: Chats[];   
}
