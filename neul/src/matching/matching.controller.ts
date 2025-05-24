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
import { ApplyUserDto } from './dto/res/apply-user.dto';
import { MatchPayDto } from './dto/req/match-pay.dto';
import { MatchPayOKDto } from './dto/req/match-pay-ok.dto';
import { ScheduleDto } from './dto/res/schedule.dto';
import { ApplyAllDto } from './dto/res/apply-all.dto';
import { DeleteMatchDto } from './dto/req/delete-match.dto';

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
    @ApiBody({type: DeleteStatusDto})
    async slectUserDelete(@Body() body: number[]){
        return this.matchingService.userDel(body);
    };

    // 신청한 도우미 리스트 전달
    @Get('/myapplication-list')
    @UseGuards(JwtAuthGuard)
    async myHelperList(@Req() req){
        const userId = req.user.id;
        return this.matchingService.myHelperList(userId);
    }

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
        return this.matchingService.helperAccept(dto.adminId, dto.userId);
    }

    // 도우미 매칭 거절 + 알림 추가
    @Post('/cancel')
    async helperCancel(@Body() dto: MatchCancelDto){
        return this.matchingService.helperCancel(dto.adminId, dto.userId, dto.content);
    }

    // 사용자 매칭 결제 요청
    @Post('/create-payment')
    @UseGuards(JwtAuthGuard)
    async helperMatch(@Body() dto: MatchPayDto, @Req() req){
        const userId = req.user.id;
        return this.matchingService.helperMatch(userId, dto);
    }

    // 사용자 매칭 결제 완료 + 매칭테이블 추가 + 채팅방 생성 + 알림 추가
    @Post('/confirm')
    @UseGuards(JwtAuthGuard)
    async helperMatchOK(@Body() dto: MatchPayOKDto, @Req() req){
        const userId = req.user.id;
        return this.matchingService.helperMatchOK(userId, dto);
    }

    // 사용자 매칭 끝 (신청내역 전달)
    @Get('/usercheck')
    @ApiResponse({type: ApplyAllDto})
    async applyAll(@Query('userId') userId: number){
        return this.matchingService.getApplyAll(userId)
    }
    
    // 사용자 매칭 끝2 (매칭테이블 취소 + 알림 추가)
    @Post('/deletematch')
    async deleteMatch(@Body() dto: DeleteMatchDto){
        return this.matchingService.deleteMatch(dto.id, dto.userId, dto.adminId);
    }

    // 전체 회원 검색
    @Get('/searchuser')
    @ApiResponse({type: UserPatientDto})
    async serchUser(@Query() dto: SearchUserDto){
        return this.matchingService.getSerchUser(dto);
    }

    // 담당 회원 검색
    @Get('/search')
    @UseGuards(JwtAuthGuard)
    async searchUserSelected(@Req() req, @Query() dto: SearchUserDto){
        const userId = req.user.id;
        return this.matchingService.getSerchUserSelected(userId, dto);
    }

    // 해당 도우미에게 매칭 신청한 유저 전달
    @Get('/applyuser')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({type: ApplyUserDto})
    async applyUser(@Req() req){
        const userId = req.user.id;
        return this.matchingService.applyUser(userId);
    }

    // 매칭된 일정 전달 (도우미)
    @Get('/schedule')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({type: ScheduleDto})
    async helperSchedule(@Req() req){
        const userId = req.user.id;
        return this.matchingService.helperSchedule(userId);
    }
}
