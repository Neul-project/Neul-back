import { ApiProperty } from '@nestjs/swagger';

export class PayOrderIdDto {
  @ApiProperty({ example: 'order_1_1715842890000', description: '생성된 주문 ID' })
  orderId: string;
}