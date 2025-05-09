import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: '서울 노원구 공릉로 264 191-123', description: '등록된 주소'})
  address: string;
}
