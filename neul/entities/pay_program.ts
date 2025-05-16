import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Pay } from './pay';
import { Programs } from './programs';

@Entity('pay_programs')
export class PayPrograms {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pay, (pay) => pay.payPrograms, { onDelete: 'CASCADE' })
  pay: Pay;

  @ManyToOne(() => Programs, (program) => program.payPrograms, { onDelete: 'CASCADE' })
  program: Programs;
}
