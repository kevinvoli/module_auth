import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Utilisateurs } from './entities/user.entity';
import { Roles } from 'src/role/entities/roles.entity';

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
  providers: [UsersService],
})
export class UsersModule {}
