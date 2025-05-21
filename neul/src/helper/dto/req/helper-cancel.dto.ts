import { ApiProperty } from '@nestjs/swagger';

export class HelperCancelDto {
  @ApiProperty({ example: 3, description: '도우미 ID' })
  id: number;

  @ApiProperty({ example: '개인사정으로 반려되었습니다.', description: '반려 사유' })
  content: string;
}