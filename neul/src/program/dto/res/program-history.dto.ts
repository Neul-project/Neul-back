import { ApiProperty } from '@nestjs/swagger';

export class ProgramHistoryDto {
  @ApiProperty({ example: 1, description: '프로그램 ID' })
  id: number;

  @ApiProperty({ example: '디지털 역량 강화 교육', description: '프로그램 이름' })
  name: string;

  @ApiProperty({ example: '결제 완료', description: '결제 상태' })
  payment_status: string;

  @ApiProperty({ example: '홍길동', description: '프로그램 담당자' })
  manager: string;

  @ApiProperty({ example: 50000, description: '결제 금액' })
  price: number;

  @ApiProperty({ example: 'program.jpg', description: '프로그램 이미지' })
  img: string;

  @ApiProperty({ example: '환불 완료', description: '환불 상태', nullable: true })
  refund_status?: string; // 환불이 없을 경우 null
}
