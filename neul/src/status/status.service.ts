import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'entities/status';
import { Between, Repository } from 'typeorm';
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

    // 상태기록 등록 (관리자)
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

    // 상태기록 수정 (관리자)
    async updateSta(id: number, dto: CreateStatusDto){
        const updateStatus = {
            patient: {id: dto.patient_id},
            admin: {id: dto.adminId},
            meal: (dto.meal ?? []).join(','),
            condition: dto.condition,
            medication: dto.medication,
            sleep: dto.sleep,
            pain: dto.pain,
            note: dto.note,
        };

        return await this.statusRepository.update(id, updateStatus);
    }

    // 전체 상태기록 전달 (관리자)
    async getAllList(adminId: number){
        const status = await this.statusRepository.find({
            where: { admin: {id: adminId}},
            relations: ['patient', 'admin'],
        });
        
        return status;
    }

    // 선택한 피보호자 상태기록 전달 (관리자)
    async getSelectList(adminId: number, patientId: number){
        const status = await this.statusRepository.find({
            where: {
                admin: {id: adminId},
                patient: {id: patientId}
            },
            relations: ['patient']
        });

        return status;
    }

    // 담당 피보호자 전달 (관리자)
    async contectPat(adminId: number){
        const patients = await this.patientRepository.find({
            where: { admin: {id: adminId}},
            relations: ['admin']
        });

        return patients;
    }

    // 선택한 상태기록 삭제 (관리자)
    async listDel(ids: number[]){
        if (!ids || ids.length === 0){
            throw new Error('선택한 상태기록이 존재하지 않습니다.');
        }
        
        return await this.statusRepository.delete(ids);
    }

    // 특정 날짜 상태기록 전달 (사용자)
    async dateSta(userId: number, date: string){
        const start = new Date(`${date}T00:00:00`);
        const end = new Date(`${date}T23:59:59.999`);

        const day = await this.statusRepository.find({
            where: { 
                user: {id: userId},
                recorded_at: Between(start, end)
            },
            order: { recorded_at: 'DESC'}
        });

        console.log(day);
        return day;
    }

    // 피보호자 이름 전달 (사용자)
    async nameSta(userId: number){
        const patient = await this.statusRepository.find({
            where: { user: {id: userId} },
            relations: ['patient']
        })

        // 중복 제거 > 같은 환자에게 여러 개의 상태 기록이 있을 수 있으므로!
        const name = [...new Set(patient.map( x=> x.patient.name ))];
        return name;
    }
}
