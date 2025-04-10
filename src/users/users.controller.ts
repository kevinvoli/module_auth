import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({cmd:'create_User'})
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern({cmd:'findAll_Users'})
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({cmd:'findOne_User'})
  findOne(@Payload() id: number) {
    return this.usersService.findOne(id);
  }

  @MessagePattern({cmd:'update_User'})
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern({cmd:'remove_User'})
  remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }
}
