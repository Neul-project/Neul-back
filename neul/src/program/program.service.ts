import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Programs } from 'entities/programs';
import { In, Like, Repository } from 'typeorm';
import { CreateProgramDto } from './dto/req/create-program.dto';
import { Users } from 'entities/users';
import { Pay } from 'entities/pay';
import { Refund } from 'entities/refund';
import { Cart } from 'entities/cart';
import { CreateRefundDto } from './dto/req/create-refund.dto';
import { Alert } from 'entities/alert';
import { UpdateProgramDto } from './dto/res/update-program.dto';
import { PayPrograms } from 'entities/pay_program';
import { Match } from 'entities/match';
import { PayProgramDto } from './dto/req/pay-program.dto';
import { ConfirmPayDto } from './dto/req/confirm-pay.dto';
import { CartDeleteDto } from './dto/req/cart-delete.dto';

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
        @InjectRepository(PayPrograms)
        private payProgramRepository: Repository<PayPrograms>,
        @InjectRepository(Match)
        private matchRepository: Repository<Match>
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
        const newFile = files.map((file) => file.filename) ?? [];
        const oldFile = dto.img ?? [];
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
            .leftJoin('refund', 'refund', 'refund.userId = :userId AND refund.programId = program.id', { userId })
            .where('cart.userId = :userId', { userId })
            .select([
                'program.id AS id',
                'program.name AS name',
                'cart.status AS payment_status',
                'program.manager AS manager',
                'cart.price AS price',
                'program.img AS img',
                'refund.status AS refund_status'
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
            where: { 
                user: {id: userId},
                status: '결제 대기'
            }
        });

        return { count };
    }

    // 장바구니 삭제
    async cartDel(userId: number, dto: CartDeleteDto){
        const user = await this.userRepository.findOne({ where: {id: userId} });
        if(!user){
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        if (!dto.programIds || dto.programIds.length === 0) {
            throw new Error('삭제할 프로그램 ID가 없습니다.');
        }

        await this.cartRepository.delete({
            user: {id: userId},
            program: {id: In(dto.programIds)}
        });

        return {ok: true};
    }

    // 프로그램 결제 요청
    async payPro(userId: number, dto: PayProgramDto){
        const user = await this.userRepository.findOne({ where: {id: userId} });
        if(!user){
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        const orderId = `order_${userId}_${Date.now()}`

        const pay = this.payRepository.create({
            user,
            price: dto.amount,
            orderId,
        });
        await this.payRepository.save(pay);

        for (const programId of dto.programId){
            const program = await this.programRepository.findOne({where: {id: programId}})
            if (program) {
                const pp = this.payProgramRepository.create({
                    pay,
                    program
                });
                await this.payProgramRepository.save(pp);
            }
        }

        return orderId;
    }

    // 프로그램 결제 승인
    async payProOK(userId: number, dto: ConfirmPayDto){
        const user = await this.userRepository.findOne({ where: {id: userId} });
        const match = await this.matchRepository.findOne({
            where: {user: {id: userId}},
            relations: ['admin']
        });
        
        const pay = await this.payRepository.findOne({ // orderId를 기준으로 결제 정보(pay) 조회
            where: { orderId: dto.orderId},
            relations: ['payPrograms', 'payPrograms.program']
        });

        if(!pay){
            throw new Error('해당 주문을 찾을 수 없습니다.');
        }

        pay.paymentKey = dto.paymentKey;
        await this.payRepository.save(pay);

        for (const pp of pay.payPrograms){ // 결제 상태 변경
            const program = pp.program;
            await this.cartRepository.update(
                { user: {id: userId}, program: {id: program.id}, status: '결제 대기' }, // 조건
                { pay: pay, status: '결제 완료' } // 변경
            );
        }

        const alert = this.alertRepository.create({ // 알림 추가
            user,
            admin: match.admin,
            message: 'pay'
        });
        await this.alertRepository.save(alert);

        return {
            orderId: pay.orderId,
            amount: pay.price,
            programs: pay.payPrograms.map((pp)=> ({
                id: pp.program.id,
                name: pp.program.name,
                price: pp.program.price
            }))
        };
    }

    // 프로그램 환불 리스트 전달 (관리자)
    async refundList(){
        const list = await this.refundRepository.find({
            relations: ['user', 'program']
        });

        return list.map(refund => ({
            id: refund.id,
            requester: refund.user.name,
            bank: refund.bank,
            account: refund.account,
            depositor: refund.name,
            reason: refund.note,
            programId: refund.program.id,
            programName: refund.program.name,
            price: refund.price,
            email: refund.user.email,
            phone: refund.user.phone,
            status: refund.status,
            created_at: refund.created_at
        }));
    }

    // 프로그램 환불 상태 변경 (관리자) + 알림 추가
    async refundOK(programId: number){
        const refund = await this.refundRepository.findOne({ 
            where: {program: {id: programId}},
            relations: ['user']
        });
        if(!refund){
            throw new Error('해당 프로그램의 환불 정보가 존재하지 않습니다.')
        }

        refund.status = '환불 완료';
        await this.refundRepository.save(refund);

        const match = await this.matchRepository.findOne({
            where: {user: {id: refund.user.id}},
            relations: ['admin']
        });

        const alert = this.alertRepository.create({ // 알림 추가
            user: refund.user,
            admin: match.admin,
            message: 'refund'
        });
        await this.alertRepository.save(alert);

        return {ok: true};
    }

    // 프로그램 신청 사람 수
    async payList(programId: number){
        const count = await this.cartRepository.count({
            where: {
                program: {id: programId},
                status: '결제 완료'
            }
        });

        return count;
    }

    // 프로그램 결제 리스트 전달
    async paymentList(){
        const payment = await this.payRepository.find({
            relations: ['user', 'payPrograms', 'payPrograms.program'],
        });

        const result = payment.flatMap((pay) =>
            pay.payPrograms.map((pp) => ({
                id: pay.id,
                programId: pp.program.id,
                programName: pp.program.name,
                programManager: pp.program.manager,
                payer: pay.user.name,
                phone: pay.user.phone,
                price: pay.price,
                create_at: pay.created_at
            }))
        );

        return result;
    }

    // 프로그램 검색 (관리자)
    async searchPro(data: string){
        const programs = await this.programRepository.find({
            where: { name: Like(`%${data}%`) }
        });

        return programs;
    }
}
