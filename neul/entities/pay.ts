import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from './users';
import { Programs } from './programs';
  
@Entity('pay')
export class Pay {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id, { cascade: true, onDelete: "CASCADE" })
  user: Users;

  @ManyToOne(() => Programs, (program) => program.id, { cascade: true, onDelete: "CASCADE" })
  program: Programs;

  @Column('enum', { enum: ['success', 'fail'], comment:'결제 상태', default: 'success' })
  payment_status: string;

  @Column('int', {comment:'결제금액', nullable: true})
  price: number;

  @CreateDateColumn({ type: 'timestamp' }) 
  created_at: Date;
}