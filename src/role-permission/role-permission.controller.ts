import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { RoleService } from '../role/role.service';
import { AssignPermissionsDto } from '../role/dto/asignePermissionsDto';

@Controller()
export class RolePermissionController {
constructor(private readonly roleService: RolePermissionService) {}

  @MessagePattern({cmd:'create_rolepermission'})
  async create(@Payload() createRolePermissionDto: AssignPermissionsDto) {
    return this.roleService.assignPermissions(createRolePermissionDto);
  }

  @MessagePattern({cmd:'findAll_rolepermission'})
  async findAll() {
    return this.roleService.findAll();
  }

  @MessagePattern({cmd:'findOne_rolepermission'})
  async findOne(@Payload() id: number) {
    return this.roleService.findOne(id);
  }

  @MessagePattern({cmd:'update_rolepermission'})
  async update(@Payload() updateRolePermissionDto: AssignPermissionsDto) {
 
    const result= await this.roleService.addPermissions(updateRolePermissionDto);    
    return result
  }

  @MessagePattern({cmd:'remove_rolepermission'})
  async remove(@Payload() AssignPermissionsDto: AssignPermissionsDto) {
    return await this.roleService.removePermissions(AssignPermissionsDto);
  }
}
