import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
  
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
  
    @Column('int', {comment:'수강료'})
    price: number;
  
    @Column('varchar', {comment:'담당자명'})
    manager: string;
  
    @Column('int', {comment:'모집인원'})
    capacity: number;
  
    @Column('varchar', {comment:'문의전화'})
    call: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    registration_at: Date;
}
  