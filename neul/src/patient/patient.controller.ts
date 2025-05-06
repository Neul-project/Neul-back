import { Body, Controller, Post } from '@nestjs/common';
import { PatientService } from './patient.service';

@Controller('patient')
export class PatientController {
    constructor(private readonly patientService: PatientService) {}

    // 추가정보 입력
    @Post('/info')
    async addPatient(@Body() body){
        console.log('환자', body);
    }
}
