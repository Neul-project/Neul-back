import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 10 })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: '01012345678' })
  phone: string;
}

export class PatientDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ example: '이슬기' })
  name: string;

  @ApiProperty({ example: '여' })
  gender: string;

  @ApiProperty({ example: '1945-03-01' })
  birth: string;

  @ApiProperty({ example: '치매 초기' })
  note: string;
}

export class ApplyDto {
  @ApiProperty({ example: 15 })
  id: number;

  @ApiProperty({ example: '승인 대기', enum: ['승인 대기', '결제 대기', '승인 반려', '결제 완료'] })
  status: string;

  @ApiProperty({ example: '2025-06-05,2025-06-06', nullable: true })
  dates: string;

  @ApiProperty({ example: '2025-05-24T12:34:56.000Z' })
  created_at: Date;
}

export class ApplyUserDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: PatientDto })
  patient: PatientDto | null;

  @ApiProperty({ type: ApplyDto })
  apply: ApplyDto;
}