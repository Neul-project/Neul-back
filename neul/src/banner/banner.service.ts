import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banners } from 'entities/banners';
import { Repository } from 'typeorm';
import { BannerRegisterDto } from './dto/req/banner-register.dto';

@Injectable()
export class BannerService {
    constructor(
        @InjectRepository(Banners)
        private bannerRepository: Repository<Banners>
    ) {}

    // 배너 등록
    async bannerRegi(dto: BannerRegisterDto, files: Express.Multer.File[]){
        const url = [dto.lefturl, dto.righturl].filter(Boolean).join(',');
        const filename = files.map((file) => file.filename).join(',');

        const banner = this.bannerRepository.create({
            img: filename,
            url: url
        });

        return await this.bannerRepository.save(banner);
    }

    // 배너 제공
    async bannerList(){
        return await this.bannerRepository.find();
    }
}
