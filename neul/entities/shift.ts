import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Users } from './users';

@Entity('shift')
export class Shift {
  @PrimaryGeneratedColumn()
  id: number;

  // 도우미
  @ManyToOne(() => Users, (user) => user.carePatients, {onDelete: 'CASCADE'})
  admin: Users;

  @Column('varchar', { comment: '가능한 첫 날' })
  startDate?: string;

  @Column('varchar', { comment: '가능한 마지막 날' })
  endDate?: string;

  @Column('varchar', { comment: '가능한 마지막 날' })
  week: string;

  @CreateDateColumn()
  created_at: Date;
}