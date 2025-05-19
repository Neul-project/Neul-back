import { ApiProperty } from '@nestjs/swagger';

export class PaymentListDto {
  @ApiProperty({ example: 1, description: '결제 PK' })
  id: number;

  @ApiProperty({ example: 101, description: '프로그램 PK' })
  programId: number;

  @ApiProperty({ example: '청소년 진로탐색 캠프', description: '프로그램 이름' })
  programName: string;

  @ApiProperty({ example: '김담당', description: '프로그램 담당자' })
  programManager: string;

  @ApiProperty({ example: '홍길동', description: '신청자 이름' })
  payer: string;

  @ApiProperty({ example: '010-1234-5678', description: '신청자 전화번호' })
  phone: string;

  @ApiProperty({ example: 50000, description: '결제 금액' })
  price: number;

  @ApiProperty({ example: '2024-05-15T12:34:56.000Z', description: '결제 일시' })
  create_at: string;
}
