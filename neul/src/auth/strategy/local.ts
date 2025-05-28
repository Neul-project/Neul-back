import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' }); // 요청 데이터 필드 지정
  }

  // 검증
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.localLogin(email, password);
    if (!user.newToken) {
      throw new UnauthorizedException('local strategy 검증 오류');
    }
    return user;
  }
}
