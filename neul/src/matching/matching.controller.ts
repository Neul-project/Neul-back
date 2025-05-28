import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { ApiResponse } from '@nestjs/swagger';
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
import { SearchMatchDto } from './dto/res/search-match.dto';
import { MatchPayOKResDto } from './dto/res/match-pay-ok-res.dto';
import { MyHelperListDto } from './dto/res/my-helper-list.dto';

@Controller('matching')
export class MatchingController {
    constructor (private readonly matchingService: MatchingService) {}

    // 신청한 도우미 리스트 전달
    @Get('/myapplication-list')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({type: MyHelperListDto})
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
        return this.matchingService.helperAccept(dto.applyId, dto.adminId, dto.userId);
    }

    // 도우미 매칭 거절 + 알림 추가
    @Post('/cancel')
    async helperCancel(@Body() dto: MatchCancelDto){
        return this.matchingService.helperCancel(dto.applyId, dto.adminId, dto.userId, dto.content);
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
    @ApiResponse({type: MatchPayOKResDto})
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

    // 회원 검색
    @Get('/search')
    @ApiResponse({type: SearchMatchDto})
    async searchUserSelected(@Query() dto: SearchUserDto){
        return this.matchingService.getSerchUserSelected(dto);
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
