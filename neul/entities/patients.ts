import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Users } from './users';
import { Activities } from './activities';

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

  @Column('varchar', { comment: '성별', nullable: true })
  gender?: string;

  @Column('varchar', { comment: '이름', nullable: true })
  name?: string;

  @Column('int', { comment: '나이', nullable: true })
  age?: number;

  @Column('text', { comment: '특이사항', nullable: true })
  note?: string;

  // 활동기록이 연결한 환자
  @OneToMany(() => Activities, (activity) => activity.patient)
  activities: Activities[];
}