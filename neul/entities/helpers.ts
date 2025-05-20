import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Users } from './users';

@Entity('helpers')
export class Helper {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;

  @Column('int', { comment: '희망 일당' })
  desiredPay: number;

  @Column('text', { comment: '경력사항' })
  experience: string;

  @Column('date', { comment: '생년월일' })
  birth: Date;

  @Column('varchar', { comment: '성별' })
  gender: string;

  @Column('varchar', { comment: '자격증 이름' })
  certificateName: string;

  @Column('varchar', { comment: '자격증 이름2', nullable: true })
  certificateName2: string;

  @Column('varchar', { comment: '자격증 이름3', nullable: true })
  certificateName3: string;

  @Column('varchar', { comment: '프로필 이미지 경로' })
  profileImage: string;

  @Column('varchar', { comment: '자격증 파일 경로' })
  certificate: string;
  
  @Column('enum', { enum: ['승인 완료', '승인 대기'], comment:'승인 상태', default: '승인 대기' })
  status: string;
}