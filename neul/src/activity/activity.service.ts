import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateActivityDto } from './dto/req/create-activity.dto';
import { In, Like, Repository } from 'typeorm';
import { Activities } from 'entities/activities';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'entities/users';
import { Patients } from 'entities/patients';
import { CreateFeedbackDto } from './dto/req/create-feedback.dto';
import { Feedback } from 'entities/feedback';
import { UpdateActivityDto } from './dto/req/update-activity.dto';

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(Activities)
        private activityRepository: Repository<Activities>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Patients)
        private patientRepository: Repository<Patients>,
        @InjectRepository(Feedback)
        private feedbackRepository: Repository<Feedback>
    ) {}

    // 활동기록 등록
    async writeAct(userId: number, dto: CreateActivityDto, files: Express.Multer.File[]){
        const filename = files.map((file) => file.filename).join(',');

        const user = await this.userRepository.findOne({where: {id: userId}});
        const patient = await this.patientRepository.findOne({ 
            where: {id: Number(dto.patient_id)},
            relations: ['user'],
        });

        if(!patient || !user){
            throw new Error('피보호자나 관리자 정보를 찾을 수 없습니다.');
        }

        const activity = this.activityRepository.create({
            title: dto.title,
            type: dto.type,
            rehabilitation: dto.rehabilitation,
            note: dto.note,
            admin: user,
            user: patient.user,
            patient: patient,
            img: filename
        });
        
        return await this.activityRepository.save(activity);
    }

    // 활동기록 수정
    async updateAct(activityId: number, dto: UpdateActivityDto, files: Express.Multer.File[]){
        const newFile = files?.map((file) => file.filename) ?? [];
        const oldFile = dto.img ?? [];
        const finalFilename = [...oldFile, ...newFile];

        const activity = await this.activityRepository.findOne({ where: {id: activityId}});
        if(!activity){
            throw new Error('활동기록을 찾을 수 없습니다.');
        }

        activity.title = dto.title;
        activity.type = dto.type;
        activity.rehabilitation = dto.rehabilitation;
        activity.note = dto.note;
        activity.img = finalFilename.join(',');

        return await this.activityRepository.save(activity);
    }

    // 활동기록 제공
    async listAct(userId: number){
        const activities = await this.activityRepository.find({
            where: {user: {id: userId}},
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

    // 전체 활동기록 전달 (관리자)
    async getAllListAct(adminId: number){
        const activities = await this.activityRepository.find({
            where: {admin: {id: adminId}},
            relations: ['patient']
        });

        return activities;
    }

    // 해당 활동기록 정보 전달 (사용자)
    async detailAct(userId: number, activityId: number){
        const activity = await this.activityRepository.findOne({
            where: {
                id: activityId,
                user: {id: userId}
            },
            relations: ['patient']
        });

        return activity;
    }

    // 선택한 활동기록 삭제
    async listDelAct(ids: number[]){
        if (!ids || ids.length === 0){
            throw new Error('선택한 활동기록이 존재하지 않습니다.');
        }

        return await this.activityRepository.delete(ids);
    }

    // 피드백 저장
    async postFeed(dto: CreateFeedbackDto){
        const user = await this.userRepository.findOne({ where: {id: dto.userId}});
        const activity = await this.activityRepository.findOne({ 
            where: {id: dto.activityid},
            relations: ['patient', 'patient.admin']
        });

        if(!user || !activity){
            throw new UnauthorizedException('유저/활동기록을 찾을 수 없습니다.');
        }

        const feedback = this.feedbackRepository.create({
            user,
            admin: activity.patient.admin,
            activity,
            message: dto.message
        });

        return await this.feedbackRepository.save(feedback);
    }

    // 전체 피드백 전달
    async allFeed(){
        const feedback = await this.feedbackRepository.find({
            relations: ['activity'],
            order: {recorded_at: 'DESC'}
        });

        return feedback;
    }

    // 관리자 별 피드백 전달
    async selectFeed(adminId: number){
        const feedback = await this.feedbackRepository.find({
            where: {admin: {id: adminId}},
            relations: ['activity'],
            order: {recorded_at: 'DESC'}
        });

        return feedback;
    }

    // 피드백 검색 (관리자)
    async searchAct(data: string){
        const activities = await this.activityRepository.find({ where: { title: Like(`%${data}%`) } });
        const activityIds = activities.map((act) => act.id);

        const feedbacks = await this.feedbackRepository.find({
            where: {activity: In(activityIds)},
            relations: ['activity', 'admin'],
        });

        return feedbacks;
    }
}
