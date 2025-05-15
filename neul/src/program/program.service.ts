import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Programs } from 'entities/programs';
import { Repository } from 'typeorm';
import { CreateProgramDto } from './dto/create-program.dto';
import { Users } from 'entities/users';
import { Pay } from 'entities/pay';
import { Refund } from 'entities/refund';
import { Cart } from 'entities/cart';
import { CreateRefundDto } from './dto/create-refund.dto';
import { Alert } from 'entities/alert';
import { Patients } from 'entities/patients';
import { UpdateProgramDto } from './dto/res/update-program.dto';

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
        private refundRepository: Repository<Refund>,
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(Alert)
        private alertRepository: Repository<Alert>,
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
            target: dto.target,
            note: dto.note,
            img: filename
        });
        return await this.programRepository.save(program);
    }

    // 프로그램 수정
    async updatePro(programId: number, dto: UpdateProgramDto, files: Express.Multer.File[]){
        const newFile = files.map((file) => file.filename);
        const oldFile = dto.img;
        const finalFilename = [...oldFile, ...newFile];

        const program = await this.programRepository.findOne({ where: {id: programId}});
        if(!program){
            throw new Error('프로그램을 찾을 수 없습니다.');
        }

        program.name = dto.name;
        program.progress = dto.progress;
        program.price = Number(dto.price);
        program.manager = dto.manager;
        program.capacity = Number(dto.capacity);
        program.recruitment = dto.recruitment;
        program.call = dto.call;
        program.category = dto.category;
        program.note = dto.note;
        program.target = dto.target;
        program.img = finalFilename.join(',');
        
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

        const pay = this.cartRepository.create({
            user,
            program,
            price: program.price,
        });

        return await this.cartRepository.save(pay);
    }

    // 프로그램 신청내역 전달
    async historyPro(userId: number){
        return await this.programRepository
            .createQueryBuilder('program')
            .leftJoin('program.cart', 'cart')
            .where('cart.userId = :userId', { userId })
            .select([
                'program.id AS id',
                'program.name AS name',
                'cart.status AS payment_status',
                'program.manager AS manager',
                'cart.price AS price',
                'program.img AS img'
            ])
            .getRawMany();
    }

    // 프로그램 환불 신청
    async refundPro(userId: number, dto: CreateRefundDto){
        const user = await this.userRepository.findOne({ where: {id: userId}});
        const program = await this.programRepository.findOne({ where: {id: dto.programs_id}});
        
        if(!user || !program){
            throw new Error('유저 또는 프로그램을 찾을 수 없습니다.');
        }
        
        const refund = this.refundRepository.create({
            user,
            program,
            account: dto.account,
            name: dto.name,
            bank: dto.bank,
            note: dto.note,
            price: program.price
        });
        await this.refundRepository.save(refund);

        return {ok: true};
    }

    // 프로그램 삭제
    async deletePro(ids: number[]){
        if (!ids || ids.length === 0){
            throw new Error('선택한 프로그램이 존재하지 않습니다.');
        }

        return await this.programRepository.delete(ids);
    }

    // 장바구니 개수
    async cartCount(userId: number){
        const count = await this.cartRepository.count({
            where: { user: {id: userId} }
        });

        return { count };
    }
}
