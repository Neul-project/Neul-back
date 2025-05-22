import { ApiProperty } from '@nestjs/swagger';

export class MatchPayDto {
  @ApiProperty({ example: 'order_1_1715842890000', description: '주문 ID' })
  orderId: string;

  @ApiProperty({ example: 3, description: '도우미 id' })
  helperId: number;

  @ApiProperty({ example: 35000, description: '결제 금액' })
  amount: number;
}
