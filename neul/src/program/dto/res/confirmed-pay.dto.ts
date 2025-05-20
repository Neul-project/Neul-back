import { ApiProperty } from '@nestjs/swagger';

class ConfirmedProgram {
  @ApiProperty({ example: 1, description: '프로그램 ID' })
  id: number;

  @ApiProperty({ example: '미술치료', description: '프로그램 이름' })
  name: string;

  @ApiProperty({ example: 18000, description: '프로그램 가격' })
  price: number;
}

export class ConfirmedPayDto {
  @ApiProperty({ example: 'order_1_1715842890000', description: '주문 ID' })
  orderId: string;

  @ApiProperty({ example: 35000, description: '총 결제 금액' })
  amount: number;

  @ApiProperty({ description: '결제된 프로그램 목록', type: () => ConfirmedProgram })
  programs: ConfirmedProgram[];
}
