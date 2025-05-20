import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPayDto {
  @ApiProperty({ example: 'order_1_1715842890000', description: '주문 ID' })
  orderId: string;

  @ApiProperty({ example: 'pay_abcdef123456', description: 'Toss 결제 키' })
  paymentKey: string;

  @ApiProperty({ example: 35000, description: '결제 금액' })
  amount: number;
}
