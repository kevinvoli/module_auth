import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from './casl-ability.factory';
import { EntityLoader } from './entity-loader.service';
import { Roles } from 'src/role/entities/roles.entity';
import { Permissions } from 'src/permission/entities/permission.entity';
import { PermissionService } from 'src/permission/permission.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([Roles,Permissions]),
    
    ],
   controllers: [
     
    ],
    providers: [
      CaslAbilityFactory,
      EntityLoader,
      PermissionService
    ],
})
export class CaslModule {}