import { ApiProperty } from '@nestjs/swagger';
import { PatientDto, UserDto } from './apply-user.dto';

export class ApplyDto {
  @ApiProperty({ example: '2025-06-01,2025-06-02', nullable: true })
  dates: string | null;
}

export class MatchDto {
  @ApiProperty({ example: '2025-05-24T12:34:56.000Z', nullable: true })
  matching_at: string | null;
}

export class SearchMatchDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: PatientDto, nullable: true })
  patient: PatientDto | null;

  @ApiProperty({ type: ApplyDto })
  apply: ApplyDto;

  @ApiProperty({ type: MatchDto })
  match: MatchDto;
}
