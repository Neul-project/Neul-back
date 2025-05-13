import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patients } from 'entities/patients';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Users } from 'entities/users';
import { AddPatientDto } from './dto/add-patient.dto';

@Injectable()
export class PatientService {
    constructor(
        @InjectRepository(Patients)
        private patientRepository: Repository<Patients>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {}

    // 로컬로그인 피보호자 정보 입력
    async createPat(dto: CreatePatientDto){
        const user = await this.userRepository.findOne({ where: {id: dto.userId}});
        if(!user){
            throw new Error('해당 유저를 찾을 수 없습니다.');
        }

        const patient = this.patientRepository.create({
            name: dto.name,
            gender: dto.gender,
            birth: dto.birth,
            note: dto.note,
            user
        });

        return await this.patientRepository.save(patient);
    }

    // 소셜로그인 피보호자 추가정보 입력
    async addPat(userId: number, dto: AddPatientDto){
        const user = await this.userRepository.findOne({ where: {id: userId} })
        if(!user){
            throw new Error('해당 유저를 찾을 수 없습니다.');
        }
        if (user.role !== 'user') {
            throw new Error('가족 계정만 환자 정보를 등록할 수 있습니다.');
        }
        
        const patient = this.patientRepository.create({
            name: dto.name,
            gender: dto.gender,
            birth: dto.birth,
            note: dto.note,
            user
        });
        await this.patientRepository.save(patient);

        return { ok: true }
    }

    // 피보호자 이름 전달
    async namePat(userId: number){
        const patient = await this.patientRepository.findOne({
            where:{user: {id: userId}},
            relations: ['user']
        });

        return { name: patient?.name };
    }

    // 피보호자 정보 전달
    async patientInfo(userId: number){
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['familyPatients']
        });

        const patient = user.familyPatients[0];

        return {
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
            ward: patient ? {
                name: patient.name,
                gender: patient.gender,
                birth: patient.birth,
                note: patient.note
            } : null
        };
    }

    // 피보호자 정보 수정
    async updatePat(userId: number, newNote: string){
        const patient = await this.patientRepository.findOne({
            where:{user: {id: userId}},
            relations: ['user']
        });

        patient.note = newNote;
        await this.patientRepository.save(patient);
        
        return { ok: true };
    }
}
