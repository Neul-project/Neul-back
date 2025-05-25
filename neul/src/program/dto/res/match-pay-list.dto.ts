import { ApiProperty } from '@nestjs/swagger';

export class MatchPayListDto {
  @ApiProperty({ example: 1, description: '결제 ID' })
  id: number;

  @ApiProperty({ example: 'order_1_1715842890000', description: '주문 ID' })
  orderId: string;

  @ApiProperty({ example: 35000, description: '결제 금액' })
  price: number;

  @ApiProperty({ description: '유저 ID', example: 42 })
  userId: number;

  @ApiProperty({ example: '홍보호자', description: '매칭신청한 보호자 이름' })
  userName: string;

  @ApiProperty({ example: '김도우미', description: '매칭된 도우미 이름' })
  adminName: string;

  @ApiProperty({ example: '2024-05-25T12:00:00.000Z', description: '결제 일시' })
  created_at: Date;
}
