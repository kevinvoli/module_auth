import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {

  constructor(
    @InjectRepository(Permissions)
    private readonly permissionRepository: Repository<Permissions>,
  ){}


  create(createPermissionDto: CreatePermissionDto) {
    return 'This action adds a new permission';
  }

  async findAll() {
    try {
      const ligne = await this.permissionRepository.find({
       
      })
      return ligne
    } catch (error) {
      throw new HttpException("echec de la creation de article", HttpStatus.NOT_FOUND)

    }
  }

  async findAllRole(roleId:number) {
    console.log("les permission blezlbl:", roleId);

    try {
      const permission = await this.permissionRepository.find({
       where: {
        roleId:roleId
       }
      })
      console.log("les permission blezlbl:", permission);
      
      return permission
    } catch (error) {
      throw new HttpException("echec de l'optention des permission", HttpStatus.NOT_FOUND)

    }
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
