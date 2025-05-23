import { ApiProperty } from '@nestjs/swagger';
import { AdminInfoDto } from '../req/admin-info.dto';

export class ContectPatientDto {
  @ApiProperty({ type: AdminInfoDto, description: '기록 작성 관리자 정보' })
  admin: AdminInfoDto;

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
