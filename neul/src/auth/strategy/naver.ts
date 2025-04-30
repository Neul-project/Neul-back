import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-naver";
import { AuthService } from "../auth.service";

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver'){
    constructor(private readonly authService: AuthService){
        super({
            clientID: process.env.NAVER_CLIENT_ID,
            clientSecret: process.env.NAVER_CLIENT_SECRET,
            callbackURL: process.env.NAVER_REDIRECT_URL,
        });
    }

    async validate(
        accessToken: string, 
        refreshToken: string, 
        profile: Profile, 
        done: (error: any, user?: any, info?: any) => void
    ){
        try{
            console.log(profile, '네이버 전략 콘솔')
            const { _json } = profile
            const user = {
                email: _json.email,
                name: _json.name ?? "네이버 사용자",
                phone: _json.mobile ?? "01012341234",
                provider: 'naver'
            };
            done(null, user);
        } catch (err){
            done(err)
        }
    }
}