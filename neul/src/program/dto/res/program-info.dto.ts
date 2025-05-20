import { ApiProperty } from '@nestjs/swagger';

export class ProgramInfoDto {
  @ApiProperty({ example: 1, description: '프로그램 ID' })
  id: number;

  @ApiProperty({ example: '건강', description: '카테고리' })
  category: string;

  @ApiProperty({ example: '헬스 스트레칭 프로그램', description: '프로그램명' })
  name: string;

  @ApiProperty({ example: 'image.jpg', description: '프로그램 이미지 URL', required: false })
  img?: string;

  @ApiProperty({ example: '2025.06.01 ~ 2025.06.30', description: '진행기간' })
  progress: string;

  @ApiProperty({ example: '2025.05.01 ~ 2025.05.31', description: '모집기간' })
  recruitment: string;

  @ApiProperty({ example: '성인 남녀 누구나', description: '대상' })
  target: string;

  @ApiProperty({ example: '전문 트레이너와 함께하는 스트레칭 프로그램입니다.', description: '프로그램 내용' })
  note: string;

  @ApiProperty({ example: 50000, description: '수강료 (단위: 원)' })
  price: number;

  @ApiProperty({ example: '홍길동', description: '담당자명' })
  manager: string;

  @ApiProperty({ example: 20, description: '모집인원' })
  capacity: number;

  @ApiProperty({ example: '010-1234-5678', description: '문의전화' })
  call: string;

  @ApiProperty({ example: '2025-05-20T10:00:00.000Z', description: '등록일' })
  registration_at: Date;
}