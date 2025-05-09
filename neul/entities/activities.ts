import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from './users';
import { Patients } from './patients';
  
@Entity('activities')
export class Activities {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patients, (patient) => patient.id, {onDelete: "CASCADE"})
  patient: Patients;

  // 가족
  @ManyToOne(()=> Users, (user) => user.familyPatients, {onDelete: 'CASCADE'})
  user: Users;

  // 도우미
  @ManyToOne(() => Users, (user) => user.carePatients, {onDelete: 'CASCADE'})
  admin: Users

  @Column('varchar', { comment: '활동 제목'})
  title: string;

  @Column('varchar', { comment: '활동 이미지', nullable: true })
  img?: string;

  @Column('varchar', { comment: '활동 타입' })
  type: string;

  @Column('enum', { enum: ['yes', 'no', 'none'], comment:'재활치료 여부', default: 'none' })
  rehabilitation: string;

  @Column('text', { comment: '특이사항', nullable: true })
  note?: string;

  @CreateDateColumn({ type: 'timestamp' }) 
  recorded_at: Date;
}
  