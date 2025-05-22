import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserPatientDto } from './dto/res/user-patient.dto';
import { DeleteStatusDto } from 'src/status/dto/req/delete-status.dto';
import { MatchOKDto } from './dto/req/match-ok.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { SearchUserDto } from './dto/req/search-user.dto';
import { MatchCancelDto } from './dto/req/match-cancel.dto';
import { MatchSubmitDto } from './dto/req/match-submit.dto';

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

    // 사용자 매칭 신청 + 알림 추가
    @Post('/submit-request')
    @UseGuards(JwtAuthGuard)
    async submitRequest(@Body() dto: MatchSubmitDto, @Req() req){
        const userId = req.user.id;
        return this.matchingService.submitReq(userId, dto);
    }

    // 도우미 매칭 수락 + 알림 추가
    @Post('/accept')
    async helperAccept(@Body() dto: MatchOKDto){
        console.log(dto, '매칭수락임')
        return this.matchingService.helperAccept(dto.adminId, dto.userId);
    }

    // 도우미 매칭 거절 + 알림 추가
    @Post('/cancel')
    async helperCancel(@Body() dto: MatchCancelDto){
        return this.matchingService.helperCancel(dto.adminId, dto.userId, dto.content);
    }

    // 사용자 매칭 결제 완료 + 알림 추가


    // async userMatching(@Body() dto: MatchUserDto){
    //     return this.matchingService.userMatch(dto.adminId, dto.userId, dto.patientId);
    // }

    // // 피보호자-관리자 매칭 취소 + 사용자쪽 채팅 내역 삭제 + 알림 추가
    // @Patch('/cancel')
    // async userNotMatching(@Body() dto: MatchUserDto){
    //     return this.matchingService.userNotMatch(dto.adminId, dto.userId, dto.patientId);
    // }

    // 전체 회원 검색
    @Get('/searchuser')
    @ApiResponse({type: UserPatientDto})
    async serchUser(@Query() dto: SearchUserDto){
        return this.matchingService.getSerchUser(dto);
    }

    // 해당 도우미에게 매칭 신청한 유저 전달
    @Get('/applyuser')
    @UseGuards(JwtAuthGuard)
    async applyUser(@Req() req){
        const userId = req.user.id;
        return this.matchingService.applyUser(userId);
    }
}
