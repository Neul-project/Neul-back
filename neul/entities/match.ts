import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './users';
import { Patients } from './patients';
  
@Entity('match')
export class Match {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Users, (user) => user.id, { cascade: true, onDelete: "CASCADE" })
    admin: Users;
    
    @ManyToOne(() => Patients, (patient) => patient.id, { cascade: true, onDelete: "CASCADE" })
    patient: Patients;
}