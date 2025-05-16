import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProgramService } from './program.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { ApiConsumes } from '@nestjs/swagger';
import { CreateProgramDto } from './dto/create-program.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateRefundDto } from './dto/create-refund.dto';
import { DeleteStatusDto } from 'src/status/dto/delete-status.dto';
import { UpdateProgramDto } from './dto/res/update-program.dto';

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

    // 프로그램 전체 전달
    @Get('/list')
    async allProgram(){
        return this.programService.allPro();
    }

    // 선택된 프로그램 전달
    @Get('/detail')
    async detailProgram(@Query('detailid') detailid: number){
        return this.programService.detailPro(detailid);
    }

    // 프로그램 신청
    @Post('/apply')
    @UseGuards(JwtAuthGuard)
    async applyProgram(@Req() req, @Body() body){
        const userId = req.user.id;
        return this.programService.applyPro(userId, body.programId);
    }

    // 프로그램 신청내역 전달
    @Get('/histories')
    @UseGuards(JwtAuthGuard)
    async historyProgram(@Req() req){
        const userId = req.user.id;
        return this.programService.historyPro(userId);
    }

    // 프로그램 환불 신청
    @Post('/refund')
    @UseGuards(JwtAuthGuard)
    async refundProgram(@Req() req, @Body() dto: CreateRefundDto){
        const userId = req.user.id;
        return this.programService.refundPro(userId, dto);
    }

    // 프로그램 삭제
    @Delete('/delete')
    async deleteProgram(@Body() dto: DeleteStatusDto){
        return this.programService.deletePro(dto.ids);
    }

    // 장바구니 개수 요청
    @Get('/count')
    @UseGuards(JwtAuthGuard)
    async cartCount(@Req() req){
        const userId = req.user.id;
        return this.programService.cartCount(userId);
    }
}
