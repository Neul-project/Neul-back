import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './users';
import { Patients } from './patients';
  
@Entity('match')
export class Match {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Users, (user) => user.id, { onDelete: "CASCADE" })
    admin: Users;
    
    @ManyToOne(() => Patients, (patient) => patient.id, { onDelete: "CASCADE" })
    patient: Patients;
}