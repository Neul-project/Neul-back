import { ApiProperty } from '@nestjs/swagger';

class ChargeInfo {
  @ApiProperty({ example: 10000, description: '결제 금액' })
  price: number;

  @ApiProperty({ example: 'ORD123456789', description: '주문 ID' })
  orderId: string;

  @ApiProperty({ example: '2025-05-25T12:34:56.789Z', description: '결제 생성일시' })
  created_at: Date;
}

export class MatchPayOKResDto {
  @ApiProperty({ example: '홍길동', description: '유저 이름' })
  userName: string;

  @ApiProperty({ example: '김도우미', description: '도우미 이름' })
  adminName: string;

  @ApiProperty({ type: ChargeInfo, description: '결제 정보' })
  charge: ChargeInfo;

  @ApiProperty({ example: '2025-06-01,2025-06-03', description: '신청 날짜 목록'})
  dates: string;
}
