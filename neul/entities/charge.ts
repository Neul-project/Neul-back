import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from './users';
  
@Entity('charge')
export class Charge {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: "CASCADE" })
  user: Users;

  @Column('int', {comment:'결제 금액'})
  price: number;

  @Column('varchar', { comment: '결제 ID' })
  orderId: string;

  @Column('varchar', { comment: '결제 키', nullable: true })
  paymentKey?: string;
  
  @CreateDateColumn({ type: 'timestamp' }) 
  created_at: Date;
}