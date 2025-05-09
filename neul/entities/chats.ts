import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from './users';
import { ChatRoom } from './chat_room';
  
@Entity('chats')
export class Chats {
    @PrimaryGeneratedColumn()
    id: number;
  
    // 가족
    @ManyToOne(()=> Users, (user) => user.familyPatients, {cascade: true, onDelete: 'CASCADE'})
    user: Users;

    // 도우미
    @ManyToOne(() => Users, (user) => user.carePatients, {cascade: true, onDelete: 'CASCADE'})
    admin: Users;
  
    @Column('text', { comment: '채팅내용' })
    message: string;

    @Column('boolean', {comment: '읽음여부', default: false})
    read: boolean

    @Column('varchar', { comment: '보낸 사람', default: 'user' })
    sender: 'user' | 'admin';

    @ManyToOne(() => ChatRoom, (room) => room.chats, {cascade: true, onDelete: 'CASCADE'})
    room: ChatRoom;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}