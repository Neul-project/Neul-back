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
import { ActivityPatientQueryDto } from './dto/req/activity-patient-query.dto';
import { FeedbackQueryDto } from './dto/req/feedback-query.dto';

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

    // 선택한 피보호자 전달 (관리자)
    async selectList(query: ActivityPatientQueryDto){
        const {adminId, patientId, userId, activityId} = query;
        const whereCondition: any = {};

        if(adminId){
            if(patientId){ // 1-1) adminId + patientId
                whereCondition.admin = {id: adminId};
                whereCondition.patient = {id: patientId};
            }
            else { // 1-2) adminId만
                whereCondition.admin = {id: adminId};
            }
        }
        else if(userId){ // 2-1) userId + activityId
            if(activityId){
                whereCondition.user = {id: userId};
                whereCondition.id = activityId;
            }
            else { // 2-2) userId만
                whereCondition.user = {id: userId};                
            }
        }

        const activity = await this.activityRepository.find({
            where: whereCondition,
            relations: ['patient', 'admin']
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

    // 관리자 별 피드백 전달
    async selectFeed(query: FeedbackQueryDto){
        const {adminId, search} = query;

        // 활동기록 title 기준 검색 함수
        const getSearchTitle = async (search: string) => {
            const activities = await this.activityRepository.find({
                where: { title: Like(`%${search}%`) },
            });

            return activities.map((act)=> act.id);
        }

        if(search){ // 검색어가 있을 경우
            const activityIds = await getSearchTitle(search);
            if (activityIds.length === 0) return [];

            const whereCondition: any = { activity: In(activityIds) };

            if(adminId && adminId != 0){ // 해당 관리자의 피드백에서 검색결과 전달
                whereCondition.admin = {id: adminId};
            }

            return this.feedbackRepository.find({ // 전체 피드백에서 검색결과 전달
                where: whereCondition,
                relations: ['activity', 'admin']
            });
        }

        if(adminId && adminId != 0){ // 검색 없이 해당 관리자의 피드백 전달
            return this.feedbackRepository.find({
                where: {admin: {id: adminId}},
                relations: ['activity', 'admin']
            })
        }

        return await this.feedbackRepository.find({ // 전체 피드백 전달
            relations: ['activity', 'admin'],
        });
    }
}
