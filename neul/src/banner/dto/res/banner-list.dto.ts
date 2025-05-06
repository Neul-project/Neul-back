import { ApiProperty } from '@nestjs/swagger';

export class BannerListDto {
  @ApiProperty({ example: 'banner1.jpg,banner2.png', description: '배너 이미지 파일명' })
  img: string;
}