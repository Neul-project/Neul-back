import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserPatientDto } from './dto/res/user-patient.dto';
import { DeleteStatusDto } from 'src/status/dto/delete-status.dto';
import { MatchUserDto } from './dto/match-user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('matching')
export class MatchingController {
    constructor (private readonly matchingService: MatchingService) {}

    // 전체 유저 전달
    @Get('/alluser')
    @ApiResponse({type: UserPatientDto})
    async userAll(){
        return this.matchingService.userAll();   
    }

    // 담당 유저 전달
    @Get('/matchuser')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({type: UserPatientDto})
    async userSelected(@Req() req){
        const userId = req.user.id;
        return this.matchingService.userSelect(userId);
    }

    // 선택한 유저 탈퇴
    @Delete('/userdelete')
    @ApiBody({type: DeleteStatusDto})
    async slectUserDelete(@Body() body: number[]){
        return this.matchingService.userDel(body);
    };

    // 피보호자-관리자 매칭 + 채팅방 생성
    @Post('/user')
    async userMatching(@Body() dto: MatchUserDto){
        return this.matchingService.userMatch(dto.adminId, dto.userId, dto.patientId);
    }

    // 피보호자-관리자 매칭 취소 + 채팅방 삭제
    @Patch('/cancel')
    async userNotMatching(@Body() dto: MatchUserDto){
        return this.matchingService.userNotMatch(dto.adminId, dto.userId, dto.patientId);
    }
}
