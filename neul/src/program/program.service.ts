import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Programs } from 'entities/programs';
import { Repository } from 'typeorm';
import { CreateProgramDto } from './dto/create-program.dto';

@Injectable()
export class ProgramService {
    constructor(
        @InjectRepository(Programs)
        private programRepository: Repository<Programs>,        
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

    // 프로그램 신청내역 전달
    // async historyPro(userId: number){
    //     const program = await this.programRepository.find({
    //         where: {}
    //     })
    // }
}
