import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm"

import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Utilisateurs } from "src/auth/entities/Utilisateurs.entity";
import { AuthService } from "src/auth/auth.service";
import { Strategy ,ExtractJwt} from 'passport-jwt';
import { PayloadInterface } from "src/auth/interface/payload.interface";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        @InjectRepository(Utilisateurs)
        private userRepository: Repository<Utilisateurs>,
        private authService: AuthService,
        private configService: ConfigService,
    ){
    super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
            secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET')
        })
    }

    
    async validate(payload: PayloadInterface) {
        console.log("user");
        
    const user = await this.userRepository.findOne({
          where:{
            id:payload.id,
          },
          loadRelationIds:true
        })
        if (!user) {
            throw new UnauthorizedException()
        }
        return user
    }
}