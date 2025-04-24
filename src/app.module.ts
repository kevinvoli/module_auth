import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { CaslModule } from './casl/casl.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { UsersModule } from './users/users.module';
import { RessourceModule } from './ressource/ressource.module';
import { RolePermissionModule } from './role-permission/role-permission.module';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      MYSQL_HOST:Joi.string().required(),
      MYSQL_PORT:Joi.number().required(),
      MYSQL_USER:Joi.string().required(),
      MYSQL_PASSWORD: Joi.string().required(),
      MYSQL_DATABASE:Joi.string().required(),
      SERVER_PORT:Joi.number().required()
    })
  }),
    AuthModule, 
    DatabaseModule, CaslModule, RoleModule,RessourceModule, PermissionModule, UsersModule, RolePermissionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
