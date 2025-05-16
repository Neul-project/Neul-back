import { ApiProperty } from '@nestjs/swagger';

export class PayProgramDto {
  @ApiProperty({ example: [1, 2], description: '프로그램 ID 목록' })
  programId: number[];

  @ApiProperty({ example: 35000, description: '총 결제 금액' })
  amount: number;
}
