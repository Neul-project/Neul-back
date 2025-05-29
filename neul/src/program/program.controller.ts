import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProgramService } from './program.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { CreateProgramDto } from './dto/req/create-program.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateRefundDto } from './dto/req/create-refund.dto';
import { DeleteIdsDto } from 'src/status/dto/req/delete-ids.dto';
import { UpdateProgramDto } from './dto/res/update-program.dto';
import { PayProgramDto } from './dto/req/pay-program.dto';
import { PayOrderIdDto } from './dto/res/pay-orderId.dto';
import { ConfirmedPayDto } from './dto/res/confirmed-pay.dto';
import { ConfirmPayDto } from './dto/req/confirm-pay.dto';
import { RefundListDto } from './dto/res/refund-list.dto';
import { RefundOKDto } from './dto/req/refund-ok.dto';
import { ProgramHistoryDto } from './dto/res/program-history.dto';
import { CartDeleteDto } from './dto/req/cart-delete.dto';
import { ProgramInfoDto } from './dto/res/program-info.dto';
import { ProgramPayListDto } from './dto/res/program-pay-list.dto';
import { MatchPayListDto } from './dto/res/match-pay-list.dto';

@Controller('program')
export class ProgramController {
    constructor (private readonly programService: ProgramService) {}

    // 프로그램 등록
    @Post('/registration')
    @UseInterceptors(
        FilesInterceptor('img', 3, {
            storage: diskStorage({
                destination: join(process.cwd(), 'uploads/image'),
                filename: (req, file, callback) => {
                    const filename = `${file.originalname}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    @ApiConsumes('multipart/form-data')
    async registProgram(@Body() dto: CreateProgramDto, @UploadedFiles() files: Express.Multer.File[]){
        return this.programService.registPro(dto, files);
    }

    // 프로그램 수정
    @Patch('/update/:programId')
    @UseInterceptors(
        FilesInterceptor('img', 3, {
            storage: diskStorage({
                destination: join(process.cwd(), 'uploads/image'),
                filename: (req, file, callback) => {
                    const filename = `${file.originalname}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    async updateProgram(@Param('programId') programId: number, @Body() dto: UpdateProgramDto, @UploadedFiles() files: Express.Multer.File[]){
        return await this.programService.updatePro(programId, dto, files);
    }

    // 프로그램 전달
    @Get('/list')
    @ApiResponse({type: ProgramInfoDto})
    async programList(@Query('detailid') detailid?: number, @Query('search') search?: string){
        return this.programService.programList(detailid, search);
    }

    // 프로그램 신청
    @Post('/apply')
    @UseGuards(JwtAuthGuard)
    async applyProgram(@Req() req, @Body() dto: RefundOKDto){
        const userId = req.user.id;
        return this.programService.applyPro(userId, dto.id);
    }

    // 프로그램 신청내역 전달
    @Get('/histories')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({type: ProgramHistoryDto})
    async historyProgram(@Req() req){
        const userId = req.user.id;
        return this.programService.historyPro(userId);
    }

    // 프로그램 환불 신청 (사용자)
    @Post('/refund')
    @UseGuards(JwtAuthGuard)
    async refundProgram(@Req() req, @Body() dto: CreateRefundDto){
        const userId = req.user.id;
        return this.programService.refundPro(userId, dto);
    }

    // 프로그램 삭제
    @Delete('/delete')
    async deleteProgram(@Body() dto: DeleteIdsDto){
        return this.programService.deletePro(dto.ids);
    }

    // 장바구니 개수 요청
    @Get('/count')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({schema: {example: {count: 2}}})
    async cartCount(@Req() req){
        const userId = req.user.id;
        return this.programService.cartCount(userId);
    }

    // 장바구니 삭제
    @Post('/delete-cart')
    @UseGuards(JwtAuthGuard)
    async cartDelete(@Req() req, @Body() dto: CartDeleteDto){
        const userId = req.user.id;
        return this.programService.cartDel(userId, dto);
    }

    // 프로그램 결제 요청
    @Post('/create')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({type: PayOrderIdDto})
    async payProgram(@Req() req, @Body() dto: PayProgramDto){
        const userId = req.user.id;
        return this.programService.payPro(userId, dto);
    }

    // 프로그램 결제 승인
    @Post('/confirm')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({type: ConfirmedPayDto})
    async payProgramOK(@Req() req, @Body() dto: ConfirmPayDto){
        const userId = req.user.id;
        return this.programService.payProOK(userId, dto);
    }

    // 프로그램 환불 리스트 전달 (관리자)
    @Get('/refund-list')
    @ApiResponse({type: RefundListDto})
    async refundList(){
        return this.programService.refundList();
    }

    // 프로그램 환불 상태 변경 (관리자)
    @Post('/refund-complete')
    async refundOK(@Body() dto: RefundOKDto){
        return this.programService.refundOK(dto.id);
    }

    // 프로그램 신청 사람 수
    @Get('/paylist')
    @ApiResponse({schema: {example: {count: 2}}})
    async payList(@Query('detailid') detailid: number){
        return this.programService.payList(detailid);
    }

    // 결제 리스트 전달
    @Get('/payment-list')
    @ApiResponse({type: ProgramPayListDto})
    @ApiResponse({type: MatchPayListDto})
    async paymentList(@Query('type') type?: string, @Query('adminId') adminId?: number){
        console.log(adminId, '컨트롤러어드민아이디확인이용~!#@!')
        return this.programService.paymentList(type, adminId);
    }
}
