import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banners } from 'entities/banners';

@Module({
  imports: [TypeOrmModule.forFeature([Banners])],
  providers: [BannerService],
  controllers: [BannerController]
})
export class BannerModule {}
