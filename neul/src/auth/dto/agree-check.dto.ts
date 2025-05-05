import { ApiProperty } from "@nestjs/swagger";

export class AgreeCheckDto {
    @ApiProperty({ example: 1, description: '유저 ID' })
    id: number;

    @ApiProperty({ example: ['privacy', 'location'], description: '동의한 약관 내용' })
    term: string[];
}