import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Patients } from './patients';
import { Users } from './users';
  
@Entity('status')
export class Status {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Patients, (patient) => patient.id, { cascade: true, onDelete: "CASCADE" })
    patient: Patients;
  
    // 가족
    @ManyToOne(()=> Users, (user) => user.familyPatients, {cascade: true, onDelete: 'CASCADE'})
    user: Users;

    // 도우미
    @ManyToOne(() => Users, (user) => user.carePatients, {cascade: true, onDelete: 'CASCADE'})
    admin: Users
  
    @Column('varchar', {comment:'식사량'})
    meal: string;
  
    @Column('varchar', {comment:'컨디션'})
    condition: string;
  
    @Column('enum', { enum: ['yes', 'no', 'none'], comment:'약 복용여부', default: 'none' })
    medication: string;
  
    @Column('text', {comment:'수면시간'})
    sleep: string;
  
    @Column('text', {comment:'통증여부'})
    pain: string;
  
    @Column('text', { comment: '특이사항', nullable: true })
    note?: string;
  
    @CreateDateColumn({ type: 'timestamp' }) 
    recorded_at: Date;
}
  