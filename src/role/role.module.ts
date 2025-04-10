import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { Permissions } from 'src/permission/entities/permission.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Roles,Permissions]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
