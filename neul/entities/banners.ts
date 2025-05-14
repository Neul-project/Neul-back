import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('banners')
export class Banners {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { comment: '배너 이미지' })
    img: string;

    @Column('text', { comment: '외부 연결', nullable: true })
    url?: string;
}