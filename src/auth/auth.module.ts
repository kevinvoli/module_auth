import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt/dist';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './jwt.service';
import { Utilisateurs } from './entities/Utilisateurs.entity';
import { JwtStrategy } from 'src/auth/strategys/jwt.strategy';
import { JwtRefreshStrategy } from 'src/auth/strategys/jwt-refresh-strategy';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { EntityLoader } from 'src/casl/entity-loader.service';
import { Roles } from 'src/role/entities/roles.entity';
import { Permissions } from 'src/permission/entities/permission.entity';
import { PermissionService } from 'src/permission/permission.service';
import { RoleService } from '../role/role.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Token,Roles,Permissions,Utilisateurs]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 3600
      }
    })
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    TokenService,
    Repository,   
    JwtService,
    ConfigService,
    JwtStrategy,
    JwtRefreshStrategy,
    CaslAbilityFactory,
    EntityLoader,
    PermissionService,
    RoleService
  ],

})
export class AuthModule {}
