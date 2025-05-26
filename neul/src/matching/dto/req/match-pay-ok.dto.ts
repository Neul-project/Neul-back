import { ApiProperty } from '@nestjs/swagger';

export class MatchPayOKDto {
  @ApiProperty({ example: 'order_1_1715842890000', description: '주문 ID' })
  orderId: string;

  @ApiProperty({ example: 3, description: '도우미 id' })
  helperId: number;

  @ApiProperty({ example: 15, description: '신청 ID' })
  applyId: number;
  
  @ApiProperty({ example: 'pay_abcdef123456', description: 'Toss 결제 키' })
  paymentKey: string;
}
