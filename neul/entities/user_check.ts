import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './users';

@Entity('user_check')
export class UserCheck {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id, { onDelete: "CASCADE" })
    user: Users;

    @Column('varchar', {comment:'약관확인', nullable: true})
    term?: string;
}