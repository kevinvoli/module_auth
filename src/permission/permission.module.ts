import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from './entities/permission.entity';
import { Roles } from 'src/role/entities/roles.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { EntityLoader } from 'src/casl/entity-loader.service';

@Module({
  imports:[    
    TypeOrmModule.forFeature([Permissions,Roles]),
  ],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    CaslAbilityFactory,
    EntityLoader
  ],
})
export class PermissionModule {}
