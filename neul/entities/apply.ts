import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Users } from './users';

@Entity('apply')
export class Apply {
  @PrimaryGeneratedColumn()
  id: number;

  // 가족
  @ManyToOne(()=> Users, (user) => user.familyPatients, {onDelete: 'CASCADE'})
  user: Users;

  // 도우미
  @ManyToOne(() => Users, (user) => user.carePatients, {onDelete: 'CASCADE'})
  admin: Users;

  @Column('text', { comment: '매칭신청 날짜들', nullable: true })
  dates?: string;

  @Column('enum', { enum: ['승인 대기', '결제 대기', '승인 반려', '결제 완료'], comment:'승인 상태', default: '승인 대기' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}