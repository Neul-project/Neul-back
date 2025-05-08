import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ContectPatientDto } from './dto/res/contect-patient.dto';
import { ListStatusDto } from './dto/res/list-status.dto';
import { DeleteStatusDto } from './dto/delete-status.dto';

@Controller('status')
export class StatusController {
    constructor (private readonly statusService: StatusService) {}
    
    // 상태기록 등록
    @Post('/write')
    @ApiBody({type: CreateStatusDto})
    async writeStatus(@Body() body: any){
        const dto: CreateStatusDto = { ...body.formatValues, adminId: body.adminId };
        return this.statusService.writeSta(dto);
    }

    // 상태기록 수정
    @Put('update/:id')
    @ApiBody({type: CreateStatusDto})
    async updateStatus(@Param('id') id: number, @Body() body: any){
        const dto: CreateStatusDto = { ...body.formatValues, adminId: body.adminId };
        return this.statusService.updateSta(id, dto);
    }

    // 전체 상태기록 전달
    @Get('/allList')
    @ApiResponse({type: ListStatusDto})
    async allList(@Query('adminId') adminId: number){
        return this.statusService.getAllList(adminId);
    }

    // 선택한 피보호자 상태기록 전달
    @Get('/selectList')
    @ApiResponse({type: ListStatusDto})
    async selectList(@Query('adminId') adminId: number, @Query('patientId') patientId: number){
        return this.statusService.getSelectList(adminId, patientId);
    }

    // 담당 피보호자 목록
    @Get('/patient')
    @ApiResponse({type: ContectPatientDto})
    async contectPatient(@Query('adminId') adminId: number){
        return this.statusService.contectPat(adminId);
    }

    // 선택한 상태기록 삭제
    @Delete('/delete')
    @ApiBody({type: DeleteStatusDto})
    async listDelete(@Body() body: number[]){
        return this.statusService.listDel(body);
    }

    // 특정 날짜 상태기록 전달
    @Get('/day')
    async dateStatus(@Query('userId') userId: number, @Query('date') date: string){
        return this.statusService.dateSta(userId, date);
    }
}
