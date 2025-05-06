import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('banners')
export class Banners {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { comment: '배너 이미지' })
    img: string;
}