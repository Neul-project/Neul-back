import { Body, Controller, Get, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/req/create-patient.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AddPatientDto } from './dto/req/add-patient.dto';
import { ApiResponse } from '@nestjs/swagger';
import { PatientInfoDto } from './dto/res/patient-info.dto';

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

    // 피보호자 정보 수정 (사용자)
    @Patch('/info')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({schema: {example: {note: '치매 초기 진단 받음'}}})
    async updatePatient(@Req() req, @Body() body){
        const userId = req.user.id;
        return this.patientService.updatePat(userId, body.note);
    }
}
