import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'entities/status';
import { Between, Repository } from 'typeorm';
import { CreateStatusDto } from './dto/req/create-status.dto';
import { Patients } from 'entities/patients';
import { Users } from 'entities/users';
import { StatusListQueryDto } from './dto/req/status-list-query.dto';

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
        const patient = await this.patientRepository.findOne({
            where: {id: dto.patient_id},
            relations: ['user'],
        });
        const admin = await this.userRepository.findOne({where: {id: dto.adminId}});

        if(!patient || !admin){
            throw new Error('환자나 관리자 정보를 찾을 수 없습니다.');
        }

        const status = this.statusRepository.create({
            patient,
            admin,
            user: patient.user,
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
        const existing = await this.statusRepository.findOne({ where: {id}});
        if(!existing){
            throw new Error('상태기록을 찾을 수 없습니다.');
        }

        existing.meal = (dto.meal ?? []).join(',');
        existing.condition = dto.condition;
        existing.medication = dto.medication;
        existing.sleep = dto.sleep;
        existing.pain = dto.pain;
        existing.note = dto.note;

        return await this.statusRepository.save(existing);
    }

    // 피보호자 상태기록 전달
    async getSelectList(query: StatusListQueryDto){
        const { adminId, patientId, userId, date } = query;

        if(userId && date){ // 날짜 별 전달
            const start = new Date(`${date}T00:00:00`);
            const end = new Date(`${date}T23:59:59.999`);

            return await this.statusRepository.find({
                where: {user: {id: userId}, recorded_at: Between(start, end)},
                relations: ['patient']
            });
        }
        
        if(adminId){ // 선택한 피보호자 전달
            const whereCondition: any = { admin: {id: adminId} }
            
            if(patientId){
                whereCondition.patient = {id: patientId};
            }

            return await this.statusRepository.find({
                where: whereCondition,
                relations: ['patient'],
                order: {recorded_at: 'DESC'},
            });
        }

        return await this.statusRepository.find({ // 전체 전달
            relations: ['patient'],
            order: {recorded_at: 'DESC'},
        });
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
}
