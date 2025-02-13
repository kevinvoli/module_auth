import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ){}


  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll() {
    try {
      const ligne = await this.rolesRepository.find({
       
      })
      return ligne
    } catch (error) {
      throw new HttpException("echec de la creation de article", HttpStatus.NOT_FOUND)

    }  
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
