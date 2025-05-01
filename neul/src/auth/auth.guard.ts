import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {};

@Injectable()
export class KakaoAuthGuard extends AuthGuard('kakao') {};

@Injectable()
export class NaverAuthGuard extends AuthGuard('naver') {};