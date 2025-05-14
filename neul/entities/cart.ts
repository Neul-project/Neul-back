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

  @Column('int', {nullable: true, comment:'결제 금액'})
  price?: number;
  
  @Column('enum', { enum: ['결제 성공', '결제 대기'], comment:'결제 상태', default: '결제 대기' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
