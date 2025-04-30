import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/signup')
    async signup(@Body() body: any) {
        console.log(body, '회원가입 전달받은 값');
        // const { email, password, name, patient, phone, role } = body;
    }
}
