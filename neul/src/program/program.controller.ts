import { Controller, Get } from '@nestjs/common';
import { ProgramService } from './program.service';

@Controller('program')
export class ProgramController {
    constructor (private readonly programService: ProgramService) {}

    // 프로그램 전체 전달
    @Get('/list')
    async allProgram(){
        return this.programService.allPro();
    }
}
