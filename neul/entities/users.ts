import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Patients } from './patients';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {comment:'이메일', nullable: true, unique: true })
  email: string;

  @Column('varchar', {comment:'비밀번호', nullable: true })
  password?: string;

  @Column('varchar', {comment:'이름', nullable: true })
  name?: string;

  @Column('varchar', {comment:'핸드폰번호', nullable: true, unique: true })
  phone?: string;

  @Column('varchar', {comment:'주소', nullable: true})
  address?: string;

  @Column('varchar', {comment:'제공자', nullable: true, default: 'local'})
  provider?: string;

  @Column('enum', {enum: ['user', 'admin'], comment:'역할', default: 'user'})
  role: 'user' | 'admin';

  // 가족이 연결한 환자
  @OneToMany(() => Patients, (patient) => patient.user)
  familyPatients: Patients[];

  // 도우미가 담당한 환자
  @OneToMany(() => Patients, (patient) => patient.admin)
  carePatients: Patients[];
}
