import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ContectPatientDto } from './dto/res/contect-patient.dto';

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

    // 담당 피보호자 목록
    @Get('/patient')
    @ApiResponse({type: ContectPatientDto})
    async contectPatient(@Query('adminId') adminId: number){
        console.log('담당자 아이디', adminId)
        return this.statusService.contectPat(adminId);
    }
}
