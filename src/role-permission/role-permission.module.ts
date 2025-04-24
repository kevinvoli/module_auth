import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/role/entities/roles.entity';
import { Permissions } from 'src/permission/entities/permission.entity';

@Module({
   imports:[
      TypeOrmModule.forFeature([Roles,Permissions]),
    ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
})
export class RolePermissionModule {}
