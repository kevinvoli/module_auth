import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from './entities/permission.entity';

@Module({
  imports:[    
    TypeOrmModule.forFeature([Permissions]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
