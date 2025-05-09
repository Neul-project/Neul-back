import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AddPatientDto } from './dto/add-patient.dto';
import { ApiResponse } from '@nestjs/swagger';
import { PatientInfoDto } from './dto/patient-info.dto';

@Controller('patient')
export class PatientController {
    constructor(private readonly patientService: PatientService) {}

    // 로컬로그인 피보호자 정보 입력
    @Post('/signup')
    async createPatient(@Body() dto: CreatePatientDto){
        return await this.patientService.createPat(dto);
    }

    // 소셜로그인 피보호자 추가정보 입력
    @Post('/info')
    @UseGuards(JwtAuthGuard)
    async addPatient(@Body() dto: AddPatientDto, @Req() req){
        const userId = req.user.id
        return await this.patientService.addPat(userId, dto);
    }

    // 피보호자 이름 전달
    @Get('/name')
    @ApiResponse({schema: {example: {name: '홍길동'}}})
    async namePatient(@Query('userId') userId: number){
        return this.patientService.namePat(userId);
    }

    // 피보호자 정보 전달
    @Get('/info')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({type: PatientInfoDto})
    async patientInfo(@Req() req){
        const userId = req.user.id;
        return this.patientService.patientInfo(userId);
    }
}
