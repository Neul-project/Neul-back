import { ApiProperty } from '@nestjs/swagger';

export class HelperUpdateDto {
  @ApiProperty({ example: '27', description: '유저 ID' })
  userId: string;

  @ApiProperty({ example: '50000', description: '희망 일당' })
  desiredPay: string;

  @ApiProperty({ example: '~경험', description: '경력 사항' })
  experience: string;

  @ApiProperty({ example: '자격증 1', description: '자격증 이름 1' })
  certificateName_01: string;

  @ApiProperty({ example: '자격증 2', description: '자격증 이름 2', required: false })
  certificateName_02?: string;

  @ApiProperty({ example: '자격증 3', description: '자격증 이름 3', required: false })
  certificateName_03?: string;
}
