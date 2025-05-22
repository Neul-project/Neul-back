import { ApiProperty } from '@nestjs/swagger';

export class UserInfoAllDto {
    @ApiProperty({ example: 1, description: '사용자 ID' })
    id: number;

    @ApiProperty({ example: '홍길동', description: '이름' })
    name: string;
    
    @ApiProperty({ example: 'Password123!', description: '비밀번호' })
    password: string;

    @ApiProperty({ example: 'test@example.com', description: '이메일' })
    email: string;

    @ApiProperty({ example: '01012345678', description: '전화번호' })
    phone: string;

    @ApiProperty({ example: '서울 노원구 공릉로 264 191-123', description: '등록된 주소'})
    address: string;
    
    @ApiProperty({ example: 'local', description: '가입 경로' })
    provider: string;

    @ApiProperty({ example: 'user', description: '역할'})
    role: string;
}
