import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from './users';
  
@Entity('match')
export class Match {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Users, (user) => user.id, { onDelete: "CASCADE" })
    admin: Users;
    
    @ManyToOne(() => Users, (user) => user.id, { onDelete: "CASCADE" })
    user: Users;

    @CreateDateColumn({ type: 'timestamp' })
    matching_at: Date;
}