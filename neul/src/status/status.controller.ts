import { Body, Controller, Post } from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Status } from 'entities/status';

@Controller('status')
export class StatusController {
    constructor (private readonly statusService: StatusService) {}
    
    // 상태기록 등록
    @Post('/write')
    @ApiBody({ type: CreateStatusDto })
    async writeStatus(@Body() body: any){
        const dto: CreateStatusDto = { ...body.formatValues, adminId: body.adminId };
        return this.statusService.writeSta(dto);
    }
}
