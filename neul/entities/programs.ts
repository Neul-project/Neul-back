import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Pay } from './pay';
import { Cart } from './cart';
  
@Entity('programs')
export class Programs {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column('varchar', {comment:'카테고리'})
    category: string;
  
    @Column('varchar', {comment:'프로그램명'})
    name: string;
  
    @Column('varchar', { comment: '프로그램 이미지', nullable: true })
    img?: string;
  
    @Column('varchar', {comment:'진행기간'})
    progress: string;
  
    @Column('varchar', {comment:'모집기간'})
    recruitment: string;

    @Column('varchar', {comment:'대상'})
    target: string;

    @Column('varchar', {comment:'프로그램 내용'})
    note: string;
  
    @Column('int', {comment:'수강료'})
    price: number;
  
    @Column('varchar', {comment:'담당자명'})
    manager: string;
  
    @Column('int', {comment:'모집인원'})
    capacity: number;
  
    @Column('varchar', {comment:'문의전화'})
    call: string;

    @OneToMany(() => Pay, (pay) => pay.program, { cascade: true, onDelete: "CASCADE" })
    pay: Pay[];

    @OneToMany(() => Cart, (cart) => cart.program, { cascade: true, onDelete: "CASCADE" })
    cart: Cart[];
  
    @CreateDateColumn({ type: 'timestamp' })
    registration_at: Date;
}
  