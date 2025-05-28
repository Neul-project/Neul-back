import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('mail')
export class Mail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {comment: '유저 이메일'})
  email: string;

  @Column('int', {comment: '인증코드'})
  code: number;

  @Column({comment: '인증 여부', default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column('string', {comment: '인증 유효기간'})
  expiresAt: Date;
}