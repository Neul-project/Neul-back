import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/req/create-status.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ContectPatientDto } from './dto/res/contect-patient.dto';
import { ListStatusDto } from './dto/res/list-status.dto';
import { DeleteIdsDto } from './dto/req/delete-ids.dto';
import { StatusListQueryDto } from './dto/req/status-list-query.dto';

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

    // 피보호자 상태기록 전달
    @Get('/selectList')
    @ApiResponse({type: ListStatusDto})
    async selectList(@Query() query: StatusListQueryDto){
        return this.statusService.getSelectList(query);
    }

    // 담당 피보호자 목록
    @Get('/patient')
    @ApiResponse({type: ContectPatientDto})
    async contectPatient(@Query('adminId') adminId: number){
        return this.statusService.contectPat(adminId);
    }

    // 선택한 상태기록 삭제
    @Delete('/delete')
    @ApiBody({type: DeleteIdsDto})
    async listDelete(@Body() body: number[]){
        return this.statusService.listDel(body);
    }
}
