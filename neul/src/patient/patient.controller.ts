import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AddPatientDto } from './dto/add-patient.dto';

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
}
