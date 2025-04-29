import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from './users';
import { Activities } from './activities';
  
@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id, { cascade: true, onDelete: "CASCADE" })
  user: Users;

  @ManyToOne(() => Activities, (activities) => activities.id, { cascade: true, onDelete: "CASCADE" })
  activity: Activities;

  @Column('text', { comment: '음성/텍스트 메시지' })
  message: string;

  @CreateDateColumn({ type: 'timestamp' }) 
  recorded_at: Date;
}