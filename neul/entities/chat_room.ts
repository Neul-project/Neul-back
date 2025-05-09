import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Users } from './users';
import { Chats } from './chats';

@Entity('chat_rooms')
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  // 보호자
  @ManyToOne(() => Users, (user) => user.chatRoomUser, {onDelete: 'CASCADE'})
  user: Users;

  // 관리자
  @ManyToOne(() => Users, (user) => user.chatRoomAdmin, {onDelete: 'CASCADE'})
  admin: Users;

  // 채팅 목록
  @OneToMany(() => Chats, (chat) => chat.room, {cascade: true, onDelete: 'CASCADE'})
  chats: Chats[];   
}
