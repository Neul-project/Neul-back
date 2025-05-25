import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Patients } from './patients';
import { ChatRoom } from './chat_room';

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

  @Column('enum', {enum: ['user', 'admin', 'manager'], comment:'역할', default: 'user'})
  role: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // 보호자가 연결한 환자
  @OneToMany(() => Patients, (patient) => patient.user, { cascade: true, onDelete: "CASCADE" })
  familyPatients: Patients[];

  // 관리자가 담당한 환자
  @OneToMany(() => Patients, (patient) => patient.admin, { cascade: true, onDelete: "CASCADE" })
  carePatients: Patients[];

  // 보호자가 참여한 채팅방들
  @OneToMany(() => ChatRoom, (room) => room.user, { cascade: true, onDelete: "CASCADE" })
  chatRoomUser: ChatRoom[];

  // 관리자가 참여한 채팅방들
  @OneToMany(() => ChatRoom, (room) => room.admin, { cascade: true, onDelete: "CASCADE" })
  chatRoomAdmin: ChatRoom[];
}
