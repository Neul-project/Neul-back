import { Controller, Get } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { ApiResponse } from '@nestjs/swagger';
import { UserPatientDto } from './dto/res/user-patient.dto';

@Controller('matching')
export class MatchingController {
    constructor (private readonly matchingService: MatchingService) {}

    // 전체 유저 전달
    @Get('/alluser')
    @ApiResponse({type: UserPatientDto})
    async userAll(){
        return this.matchingService.userAll();   
    }
}
