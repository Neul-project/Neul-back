import { ApiProperty } from '@nestjs/swagger';
import { UserInfoAllDto } from 'src/helper/dto/res/user-info-all.dto';

export class ApplyInfoDto {
    @ApiProperty({ example: '승인 대기', enum: ['승인 대기', '결제 대기', '승인 반려', '결제 완료'] })
    status: string;

    @ApiProperty({ example: '2025-05-21,2025-05-23', description: '신청한 날짜들' })
    dates: string;
}

export class MyHelperListDto {
    @ApiProperty({ example: 1, description: '도우미 ID' })
    id: number;

    @ApiProperty({ description: '도우미 상태', example: '승인 완료' })
    status: string;

    @ApiProperty({ type: UserInfoAllDto, description: '유저 정보' })
    user: UserInfoAllDto;

    @ApiProperty({ type: ApplyInfoDto, description: '신청 내역 리스트' })
    apply_list: ApplyInfoDto;
}