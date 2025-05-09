import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchingService {
    constructor(
        @InjectRepository
    )

    // 전체 유저 전달
    async userAll(){
        const users = await this.userRepository.find({
            relations: ['familyPatients']
        });

        return users.map(x => {
            const patient = x.familyPatients?.[0];

            return {
                id: x.id,
                email: x.email,
                name: x.name,
                phone: x.phone,
                patient_id: patient?.id || null,
                patient_name: patient?.name || '등록안함',
                patient_gender: patient?.gender || '등록안함',
                patient_birth: patient?.birth || '등록안함',
                patient_note: patient?.note || '등록안함',
            };
        })
    }
}
