import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Users } from './users';
import { PayPrograms } from './pay_program';
  
@Entity('pay')
export class Pay {
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

  @OneToMany(() => PayPrograms, (pp) => pp.pay, { cascade: true, onDelete: "CASCADE" })
  payPrograms: PayPrograms[];
  
  @CreateDateColumn({ type: 'timestamp' }) 
  created_at: Date;
}