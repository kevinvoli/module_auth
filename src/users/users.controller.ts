import { Controller, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { CheckPolicies } from 'src/casl/decorators/policies.decorator';
import { Action } from 'src/casl/entities/permission.entity';

@Controller()
@UsePipes(new ValidationPipe({
  whitelist:true,
  exceptionFactory: (errors) =>{
  return new RpcException(errors);
}
}
))
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'utilisateurs'),
    (ability) => ability.can(Action.Create, 'utilisateurs'),
  )
  @MessagePattern({cmd:'create_utilisateurs'})
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }


  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'utilisateurs'),
  )
  @MessagePattern({cmd:'findAll_utilisateurs'})
  findAll() {
    return this.usersService.findAll();
  }

  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'utilisateurs'),

  )
  @MessagePattern({cmd:'findOne_utilisateurs'})
  findOne(@Payload() data: number) {
    return this.usersService.findOne(data);
  }

  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'utilisateurs'),
    (ability) => ability.can(Action.Update, 'utilisateurs'),
  )
  @MessagePattern({cmd:'update_utilisateurs'})
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'utilisateurs'),
    (ability) => ability.can(Action.Delete, 'utilisateurs'),

  )
  @MessagePattern({cmd:'remove_utilisateurs'})
  remove(@Payload() data: number) {
    return this.usersService.remove(data);
  }
}
