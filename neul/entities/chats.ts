import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from './users';
  
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
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}