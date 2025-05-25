import { ApiProperty } from '@nestjs/swagger';
export class ContectPatientDto {
  @ApiProperty({ example: 1, description: '환자 ID' })
  id: number;

  @ApiProperty({ example: '홍길동', description: '환자 이름'})
  name?: string;

  @ApiProperty({ example: '남', description: '성별'})
  gender?: string;

  @ApiProperty({ example: '1945-06-08', description: '생년월일'})
  birth?: string;

  @ApiProperty({ example: '치매 초기 증상 있음', description: '특이사항'})
  note?: string;
}
