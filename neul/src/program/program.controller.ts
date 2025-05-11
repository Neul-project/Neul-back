import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProgramService } from './program.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { ApiConsumes } from '@nestjs/swagger';
import { CreateProgramDto } from './dto/create-program.dto';

@Controller('program')
export class ProgramController {
    constructor (private readonly programService: ProgramService) {}

    // 프로그램 등록
    @Post('/registration')
    @UseInterceptors(
        FilesInterceptor('img', 5, {
            storage: diskStorage({
                destination: join(process.cwd(), 'uploads'),
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
}
