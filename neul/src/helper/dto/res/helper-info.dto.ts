import { ApiProperty } from '@nestjs/swagger';
import { UserInfoAllDto } from './user-info-all.dto';

export class HelperInfoDto {
  @ApiProperty({ example: 1, description: '도우미 ID' })
  id: number;

  @ApiProperty({ type: UserInfoAllDto, description: '유저 정보' })
  user: UserInfoAllDto;

  @ApiProperty({ example: 50000, description: '희망 일당' })
  desiredPay: number;

  @ApiProperty({ example: '~경험', description: '경력 사항' })
  experience: string;

  @ApiProperty({ example: '2000-03-01', description: '생년월일' })
  birth: string;

  @ApiProperty({ example: 'male', description: '성별' })
  gender: string;

  @ApiProperty({ example: '간호조무사', description: '자격증 이름 1' })
  certificateName: string;

  @ApiProperty({ example: '요양보호사', description: '자격증 이름 2', required: false })
  certificateName2?: string;

  @ApiProperty({ example: '응급처치교육이수증', description: '자격증 이름 3', required: false })
  certificateName3?: string;

  @ApiProperty({ example: 'user.jpeg', description: '프로필 이미지 파일명' })
  profileImage: string;

  @ApiProperty({ example: 'certificate.png', description: '자격증 이미지 파일명' })
  certificate: string;

  @ApiProperty({ example: '승인 대기', description: '승인 상태' })
  status: string;

  @ApiProperty({ example: '서류 부족', required: false, description: '승인 반려 사유 (status가 승인 반려일 경우에만 존재)' })
  reason?: string;
}
