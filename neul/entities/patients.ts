import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './users';

@Entity('patients')
export class Patients {
  @PrimaryGeneratedColumn()
  id: number;

  // 가족
  @ManyToOne(()=> Users, (user) => user.familyPatients, {cascade: true, onDelete: 'CASCADE'})
  user: Users;

  // 도우미
  @ManyToOne(() => Users, (user) => user.carePatients, {cascade: true, onDelete: 'CASCADE'})
  admin: Users;

  @Column('varchar', { comment: '성별' })
  gender: string;

  @Column('varchar', { comment: '이름' })
  name: string;

  @Column('int', { comment: '나이' })
  age: number;

  @Column('text', { comment: '특이사항', nullable: true })
  note?: string;
}