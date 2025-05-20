import { ApiProperty } from '@nestjs/swagger';

export class BannerRegisterDto {
  @ApiProperty({ description: '좌측 배너 링크 URL', example: 'https://left.example.com' })
  lefturl?: string;

  @ApiProperty({ description: '우측 배너 링크 URL', example: 'https://right.example.com' })
  righturl?: string;
}