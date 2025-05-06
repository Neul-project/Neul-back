import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banners } from 'entities/banners';
import { Repository } from 'typeorm';

@Injectable()
export class BannerService {
    constructor(
        @InjectRepository(Banners)
        private bannerRepository: Repository<Banners>
    ) {}

    // 배너 등록
    async bannerRegi(files: Express.Multer.File[]){
        const filename = files.map((file) => file.filename).join(',');

        const banner = this.bannerRepository.create({
            img: filename
        });
        return await this.bannerRepository.save(banner);
    }

    // 배너 제공
    async bannerList(){
        const banners = await this.bannerRepository.find({ select: ['img'] });
        return banners;
    }
}
