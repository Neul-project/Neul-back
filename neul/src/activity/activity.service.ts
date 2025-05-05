import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Repository } from 'typeorm';
import { Activities } from 'entities/activities';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'entities/users';
import { Patients } from 'entities/patients';

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(Activities)
        private activityRepository: Repository<Activities>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Patients)
        private patientRepository: Repository<Patients>
    ) {}

    // 활동기록 등록
    async writeAct(userId: number, dto: CreateActivityDto, files: Express.Multer.File[],){
        const filename = files.map((file) => file.filename).join(',');

        const user = await this.userRepository.findOne({where: {id: userId}})
        if(!user){
            throw new UnauthorizedException('유저 없음');
        }

        const patient = await this.patientRepository.findOne({ where: {id: Number(dto.patient_id)}})
        if(!patient){
            throw new UnauthorizedException('환자 없음');
        }

        const activity = this.activityRepository.create({
            title: dto.title,
            type: dto.type,
            rehabilitation: dto.rehabilitation,
            note: dto.note,
            admin: user,
            patient: patient,
            img: filename
        });
        return await this.activityRepository.save(activity);
    }

    // 활동기록 제공
    async listAct(userId: number){
        const activities = await this.activityRepository.find({
            where: {admin: {id: userId}},
            select: ['id', 'title', 'recorded_at'],
            order: {recorded_at: 'DESC'}
        });
        
        return activities;
    }

    // 담당 피보호자 전달 (관리자)
    async targetPat(adminId: number){
        const patients = await this.patientRepository.find({
            where: {admin: {id: adminId}},
            relations: ['admin']
        });

        return patients;
    }

    // 선택한 피보호자 전달 (관리자)
    async selectList(adminId: number, patientId: number){
        const activity = await this.activityRepository.find({
            where: {
                admin: {id: adminId},
                patient: {id: patientId}
            },
            relations: ['patient']
        });

        return activity;
    }
}
