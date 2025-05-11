import { ApiProperty } from '@nestjs/swagger';

export class CreateProgramDto {
  @ApiProperty({ description: '프로그램명', example: 'Platora_project' })
  name: string;

  @ApiProperty({ description: '진행기간', example: '2021.07.06 ~ 2021.07.26' })
  progress: string;

  @ApiProperty({ description: '모집기간', example: '2021.06.01 ~ 2021.06.30' })
  recruitment: string;

  @ApiProperty({ description: '수강료', example: '10000' })
  price: string;

  @ApiProperty({ description: '담당자명', example: '코딩12' })
  manager: string;

  @ApiProperty({ description: '모집인원', example: '13' })
  capacity: string;

  @ApiProperty({ description: '문의전화', example: '01011111234' })
  call: string;

  @ApiProperty({ description: '카테고리', example: '2' })
  category: string;
}
