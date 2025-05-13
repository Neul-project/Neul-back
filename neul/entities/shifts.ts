import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Users } from './users';
import { Patients } from './patients';
  
@Entity('shifts')
export class Shifts {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Users, (user) => user.id, { onDelete: "CASCADE" })
    admin: Users;
  
    @ManyToOne(() => Patients, (patient) => patient.id, { onDelete: "CASCADE" })
    patient: Patients;
  
    @Column('varchar', {comment:'근무 시간'})
    date: string;
  
    @Column('text', { comment: '특이사항', nullable: true })
    note?: string;
}