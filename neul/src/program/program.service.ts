import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Programs } from 'entities/programs';
import { Repository } from 'typeorm';

@Injectable()
export class ProgramService {
    constructor(
        @InjectRepository(Programs)
        private programRepository: Repository<Programs>,        
    ) {}

    // 프로그램 전체 전달
    async allPro(){
        return await this.programRepository.find();
    }

    // 선택된 프로그램 전달
    async detailPro(detailid: number){
        return await this.programRepository.findOne({where: {id: detailid}});
    }
}
