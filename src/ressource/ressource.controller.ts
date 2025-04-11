import { Controller, Get, NotFoundException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { RessourceService } from './ressource.service';
import { CreateRessourceDto } from './dto/create-ressource.dto';
import { UpdateRessourceDto } from './dto/update-ressource.dto';
import { CheckPolicies } from 'src/casl/decorators/policies.decorator';
import { Action } from 'src/casl/entities/permission.entity';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';

@Controller('ressources')
@UsePipes(new ValidationPipe({
  whitelist:true,
  exceptionFactory: (errors) =>{
  return new RpcException(errors);}}))
@UseGuards(PoliciesGuard)  
export class RessourceController {
  constructor(private readonly ressourceService: RessourceService) {}

  @CheckPolicies(
      (ability) => ability.can(Action.Read, 'ressources'),
      (ability) => ability.can(Action.Create, 'ressources'),
    )
  @MessagePattern({cmd:'create_ressources'})
  create(@Payload() createRessourceDto: CreateRessourceDto) {
    return this.ressourceService.create(createRessourceDto);
  }

  @CheckPolicies(
      (ability) => ability.can(Action.Read, 'ressources')
    )
  @MessagePattern({cmd:'findAll_ressources'})
  findAll() {
    return this.ressourceService.findAll();
  }

  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'ressources')
  )
  @MessagePattern({cmd:'findOne_ressources'})
  findOne(@Payload() data: number) {
    return this.ressourceService.findOne(data);
  }

  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'ressources'),
    (ability) => ability.can(Action.Update, 'ressources')
  )
  @MessagePattern({cmd:'update_ressources'})
  update(@Payload() updateRessourceDto: UpdateRessourceDto) {
    return this.ressourceService.update(updateRessourceDto.id, updateRessourceDto);
  }


  @CheckPolicies(
    (ability) => ability.can(Action.Delete, 'ressources'),
    (ability) => ability.can(Action.Read, 'ressources'),
  )
  @MessagePattern({cmd:'remove_ressources'})
  remove(@Payload() data: number) {
    return this.ressourceService.remove(data);
  }


  // @Get()    
  // async find(

  // ) {
  //   console.log("debut de l'enregistrment");

  //   try {
  //     return await this.ressourceService.addPermission()

  //   } catch (error) {
  //     throw new NotFoundException(error);
  //   }
    
    
  // }
  // @Get("role")    
  // async findRole(

  // ) {
  //   console.log("debut de l'enregistrment");

  //   try {
  //     return await this.ressourceService.addPermissionSuperAdmin()

  //   } catch (error) {
  //     throw new NotFoundException(error);
  //   }
    
    
  // }
}
