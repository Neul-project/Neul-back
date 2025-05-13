import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from './users';
import { Programs } from './programs';
import { Pay } from './pay';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
  user: Users;

  @ManyToOne(() => Programs, (program) => program.id, { onDelete: 'CASCADE' })
  program: Programs;

  @ManyToOne(() => Pay, (pay) => pay.id, { nullable: true })
  pay?: Pay;

  @Column('boolean', { default: false, comment: '결제 여부' })
  isPaid: boolean;

  @CreateDateColumn()
  created_at: Date;
}
