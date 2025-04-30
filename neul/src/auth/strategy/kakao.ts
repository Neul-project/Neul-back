import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import { AuthService } from "../auth.service";
import { Profile } from "passport-kakao";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao'){
    constructor(private readonly authService: AuthService){
        super({
            clientID: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
            callbackURL: process.env.KAKAO_REDIRECT_URL,
        });
    }

    async validate(
        accessToken: string, 
        refreshToken: string, 
        profile: Profile, 
        done: (error: any, user?: any, info?: any) => void
    ){
        try{
            console.log(profile, '카카오 전략 콘솔')
            const {_json} = profile
            const user = {
                email: _json.kakao_account.email,
                provider: 'kakao'
            }
            done(null, user);
        } catch (err) {
            done(err)
        }
    }
}