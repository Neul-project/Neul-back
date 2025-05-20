import { ApiProperty } from '@nestjs/swagger';

export class CreateRefundDto {
  @ApiProperty({ example: 3, description: '프로그램 ID' })
  programs_id: number;

  @ApiProperty({ example: '110123456789', description: '계좌번호' })
  account: string;

  @ApiProperty({ example: '홍길동', description: '예금자명' })
  name: string;

  @ApiProperty({ example: '신한은행', description: '은행명' })
  bank: string;

  @ApiProperty({ example: '개인 사정으로 인한 환불 요청', description: '환불 사유' })
  note: string;
}
