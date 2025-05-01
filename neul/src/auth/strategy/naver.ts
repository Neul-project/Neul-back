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
            scope: ['name', 'email', 'mobile'],
        });
    }

    async validate(
        accessToken: string, 
        refreshToken: string, 
        profile: Profile, 
        done: (error: any, user?: any, info?: any) => void
    ){
        try{
            const { _json } = profile
            const user = {
                email: _json.email,
                provider: 'naver'
            };
            done(null, user);
        } catch (err){
            done(err)
        }
    }
}