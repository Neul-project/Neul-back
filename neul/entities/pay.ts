import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from './users';
  
@Entity('pay')
export class Pay {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: "CASCADE" })
  user: Users;

  @Column('varchar', {comment:'결제 프로그램'})
  programs: string;

  @Column('int', {comment:'결제 금액'})
  price: number;

  @Column('varchar', { comment: '결제 ID' })
  orderId: string;

  @CreateDateColumn({ type: 'timestamp' }) 
  created_at: Date;
}