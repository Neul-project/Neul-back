import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'entities/status';
import { Repository } from 'typeorm';
import { CreateStatusDto } from './dto/create-status.dto';
import { Patients } from 'entities/patients';
import { Users } from 'entities/users';

@Injectable()
export class StatusService {
    constructor(
        @InjectRepository(Status)
        private statusRepository: Repository<Status>,
        @InjectRepository(Patients)
        private patientRepository: Repository<Patients>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {}

    // 상태기록 등록
    async writeSta(dto: CreateStatusDto){
        const patient = await this.patientRepository.findOne({where: {id: dto.patient_id}})
        const admin = await this.userRepository.findOne({where: {id: dto.adminId}});

        if(!patient || !admin){
            throw new Error('환자나 관리자 정보를 찾을 수 없습니다.');
        }

        const status = this.statusRepository.create({
            patient,
            admin,
            meal: (dto.meal ?? []).join(','),
            condition: dto.condition,
            medication: dto.medication,
            sleep: dto.sleep,
            pain: dto.pain,
            note: dto.note,
        });

        return await this.statusRepository.save(status);
    }
}
