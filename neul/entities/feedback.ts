import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from './users';
import { Activities } from './activities';
  
@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  // 가족
  @ManyToOne(()=> Users, (user) => user.familyPatients, {onDelete: 'CASCADE'})
  user: Users;

  // 도우미
  @ManyToOne(() => Users, (user) => user.carePatients, {onDelete: 'CASCADE'})
  admin: Users;

  @ManyToOne(() => Activities, (activities) => activities.id, { onDelete: "CASCADE" })
  activity: Activities;

  @Column('text', { comment: '음성/텍스트 메시지' })
  message: string;

  @CreateDateColumn({ type: 'timestamp' }) 
  recorded_at: Date;
}