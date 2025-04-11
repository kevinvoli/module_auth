import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { Permissions } from 'src/permission/entities/permission.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { EntityLoader } from 'src/casl/entity-loader.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Roles,Permissions]),
  ],
  controllers: [RoleController],
  providers: [
    RoleService,
    CaslAbilityFactory,
    EntityLoader
  ],
})
export class RoleModule {}
