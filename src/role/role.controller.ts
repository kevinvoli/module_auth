import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, ValidationPipe, UsePipes } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/asignePermissionsDto';
import { CheckPolicies } from 'src/casl/decorators/policies.decorator';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Action } from 'src/casl/entities/permission.entity';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';

@Controller('role')
@UsePipes(new ValidationPipe({
  whitelist:true,
  exceptionFactory: (errors) =>{
  return new RpcException(errors);
}
}
))
@UseGuards(PoliciesGuard) 
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  
    @CheckPolicies(
      (ability) => ability.can(Action.Read, 'roles'),
      (ability) => ability.can(Action.Create, 'roles'),
    )
    @MessagePattern({cmd:'create_roles'})
    create(@Payload() createUserDto: CreateRoleDto) {
      return this.roleService.create(createUserDto);
    }
  
  
    @CheckPolicies(
      (ability) => ability.can(Action.Read, 'roles')
    )
    @MessagePattern({cmd:'findAll_roles'})
    findAll() {
      return this.roleService.findAll();
    }
  
    @CheckPolicies(
      (ability) => ability.can(Action.Read, 'roles')
    )
    @MessagePattern({cmd:'findOne_roles'})
    async findOne(@Payload() data: any) {
      
      return await this.roleService.findOne(data);
    }
  
    @CheckPolicies(
      (ability) => ability.can(Action.Read, 'roles'),
      (ability) => ability.can(Action.Update, 'roles')
    )
    @MessagePattern({cmd:'update_roles'})
    async update(@Payload() updateUserDto: UpdateRoleDto) {
      return await this.roleService.update(updateUserDto.id, updateUserDto);
    }
  
    @CheckPolicies(
      (ability) => ability.can(Action.Read, 'roles'),
      (ability) => ability.can(Action.Delete, 'roles'),
    )
    @MessagePattern({cmd:'remove_roles'})
    remove(@Payload() id: number) {
      return this.roleService.remove(id);
    }









}
