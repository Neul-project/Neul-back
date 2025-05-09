import { Body, Controller, Delete, Get } from '@nestjs/common';
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

    // 선택한 유저 탈퇴
    @Delete('/userdelete')
    async slectUserDelete(@Body() body){
        console.log(body, '삭제리스트');
    };
}
