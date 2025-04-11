import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Utilisateurs } from './entities/user.entity';
import { Roles } from 'src/role/entities/roles.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { EntityLoader } from 'src/casl/entity-loader.service';

@Module({
   imports: [
      TypeOrmModule.forFeature([Utilisateurs, Roles]),
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
  controllers: [UsersController],
  providers: [
    UsersService,
    CaslAbilityFactory,
    EntityLoader
  ],
})
export class UsersModule {}
