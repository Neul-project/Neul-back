import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from './users';
import { Programs } from './programs';
  
@Entity('refund')
export class Refund {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id, { onDelete: "CASCADE" })
    user: Users;

    @ManyToOne(() => Programs, (program) => program.id, { onDelete: "CASCADE" })
    program: Programs;

    @Column('varchar', {comment:'계좌번호'})
    account: string;

    @Column('varchar', {comment:'예금자명'})
    name: string;

    @Column('varchar', {comment:'은행명'})
    bank: string;

    @Column('int', {comment:'환불금액'})
    price: number;

    @Column('text', { comment: '환불사유' })
    note: string;

    @Column('enum', { enum: ['환불 완료', '환불 대기'], comment:'환불 상태', default: '환불 대기' })
    status: string;

    @CreateDateColumn({ type: 'timestamp' }) 
    created_at: Date;
}