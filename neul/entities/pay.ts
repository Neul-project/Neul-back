import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from './users';
import { Programs } from './programs';
  
@Entity('pay')
export class Pay {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: "CASCADE" })
  user: Users;

  @ManyToOne(() => Programs, (program) => program.id, { onDelete: "CASCADE" })
  program: Programs;

  @Column('int', {comment:'결제금액', nullable: true})
  price: number;

  @CreateDateColumn({ type: 'timestamp' }) 
  created_at: Date;
}