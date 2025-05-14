import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from './users';

@Entity('alert')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id, {onDelete: 'CASCADE'})
  user: Users;

  @ManyToOne(() => Users, (user) => user.id, {onDelete: 'CASCADE'})
  admin: Users;

  @Column('varchar', { comment: '알림 내용 또는 타입' })
  message: string;

  @Column('boolean', { default: false, comment: '확인 여부' })
  isChecked: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
