import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Programs } from 'entities/programs';
import { Repository } from 'typeorm';
import { CreateProgramDto } from './dto/create-program.dto';
import { Users } from 'entities/users';
import { Pay } from 'entities/pay';
import { Refund } from 'entities/refund';

@Injectable()
export class ProgramService {
    constructor(
        @InjectRepository(Programs)
        private programRepository: Repository<Programs>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Pay)
        private payRepository: Repository<Pay>,
        @InjectRepository(Refund)
        private refundRepository: Repository<Refund>
    ) {}

    // 프로그램 등록
    async registPro(dto: CreateProgramDto, files: Express.Multer.File[]){
        const filename = files.map((file) => file.filename).join(',');

        const program = await this.programRepository.create({
            category: dto.category,
            name: dto.name,
            progress: dto.progress,
            recruitment: dto.recruitment,
            price: Number(dto.price),
            manager: dto.manager,
            capacity: Number(dto.capacity),
            call: dto.call,
            img: filename
        });
        return await this.programRepository.save(program);
    }

    // 프로그램 전체 전달
    async allPro(){
        return await this.programRepository.find();
    }

    // 선택된 프로그램 전달
    async detailPro(detailid: number){
        return await this.programRepository.findOne({where: {id: detailid}});
    }

    // 프로그램 신청
    async applyPro(userId: number, programId: number){
        const user = await this.userRepository.findOne({ where: {id: userId} });
        const program = await this.programRepository.findOne({ where: {id: programId} });

        if(!user || !program){
            throw new Error('유저 또는 프로그램을 찾을 수 없습니다.');
        }

        const pay = this.payRepository.create({
            user,
            program,
            price: program.price,
        });

        return await this.payRepository.save(pay);
    }

    // 프로그램 신청내역 전달
    async historyPro(userId: number){
        return await this.programRepository
            .createQueryBuilder('program')
            .leftJoin('program.pay', 'pay')
            .where('pay.userId = :userId', { userId })
            .select([
                'program.id AS id',
                'program.name AS name',
                'pay.payment_status AS payment_status',
                'program.manager AS manager',
                'pay.price AS price',
                'program.img AS img'
            ])
            .getRawMany();
    }

    // 프로그램 환불 신청
    async refundPro(userId: number, body: any){
        
        const refund = await this.refundRepository.create({

        });

        // retrun {ok: true};
    }
}
