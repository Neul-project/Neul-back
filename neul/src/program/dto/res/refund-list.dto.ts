import { ApiProperty } from '@nestjs/swagger';

export class RefundListDto {
  @ApiProperty({ example: 1, description: '환불 PK값' })
  id: number;

  @ApiProperty({ example: '홍길동', description: '유저 이름' })
  requester: string;

  @ApiProperty({ example: '국민은행', description: '은행명' })
  bank: string;

  @ApiProperty({ example: '12345678910111', description: '계좌번호' })
  account: string;

  @ApiProperty({ example: '홍길동', description: '예금자명' })
  depositor: string;

  @ApiProperty({ example: '개인 사정으로 인한 환불 요청', description: '환불 사유' })
  reason: string;

  @ApiProperty({ example: 3, description: '프로그램 PK값' })
  programId: number;

  @ApiProperty({ example: '미술치료 프로그램', description: '프로그램 이름' })
  programName: string;

  @ApiProperty({ example: 18000, description: '환불 금액' })
  price: number;

  @ApiProperty({ example: 'hong@example.com', description: '이메일 주소' })
  email: string;

  @ApiProperty({ example: '01012345678', description: '휴대폰 번호' })
  phone: string;

  @ApiProperty({ example: '환불 완료', description: '환불 상태', nullable: true })
  status?: string;

  @ApiProperty({ example: '2024-01-01T12:00:00.000Z', description: '환불 신청 날짜' })
  created_at: Date;
}
