import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { CheckPolicies } from 'src/casl/decorators/policies.decorator';
import { Action } from 'src/casl/entities/permission.entity';

@Controller('permission')
@UsePipes(new ValidationPipe({
  whitelist:true,
  exceptionFactory: (errors) =>{
  return new RpcException(errors);}})
)
@UseGuards(PoliciesGuard) 
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'permissions'),
    (ability) => ability.can(Action.Create, 'permission'),
  )
  @MessagePattern({cmd:'create_permission'})
  create(@Payload() createUserDto: CreatePermissionDto) {
    return this.permissionService.create(createUserDto);
  }


  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'permissions')
  )
  @MessagePattern({cmd:'findAll_permission'})
  findAll() {
    console.log("finde permission");
    
    return this.permissionService.findAll();
  }

  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'permissions')
  )
  @MessagePattern({cmd:'findOne_permission'})
  findOne(@Payload() data: number) {
    return this.permissionService.findOne(data);
  }

  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'permissions'),
    (ability) => ability.can(Action.Update, 'permissions')
  )
  @MessagePattern({cmd:'update_permission'})
  update(@Payload() updateUserDto: UpdatePermissionDto) {
    return this.permissionService.update(updateUserDto.id, updateUserDto);
  }

  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'permissions'),
    (ability) => ability.can(Action.Delete, 'permissions'),
  )
  @MessagePattern({cmd:'remove_permission'})
  remove(@Payload() data: number) {
    return this.permissionService.remove(data);
  }
}
