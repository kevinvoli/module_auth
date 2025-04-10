import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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


  async create(createPermissionDto: CreatePermissionDto) {
    try {
      const exists = await this.permissionRepository.findOne({ where: { module: createPermissionDto.module, action:createPermissionDto.action } });
      if (exists) throw new BadRequestException('Permission déjà existante');
      const data = new Permissions
      data.action = createPermissionDto.action
      data.conditions = createPermissionDto.conditions
      data.module = createPermissionDto.module
  
      const permission = this.permissionRepository.create(createPermissionDto);
      return await this.permissionRepository.save(permission);
    } catch (error) {
      console.log(error.code);
      if(error.code =="ER_DUP_ENTRY"){
        throw new HttpException('ce nom existe déjà',HttpStatus.BAD_REQUEST)
      }
      throw error
      
    }
  }

  async findAll() {
    try {
      const ligne = await this.permissionRepository.find({
       relations:{roles:true}
      })
      return ligne
    } catch (error) {
      throw new HttpException("echec de la creation de article", HttpStatus.NOT_FOUND)

    }
  }
 

  async findOne(id: number) {
    try {
      const permission = await this.permissionRepository.findOne({ where: { id }, relations: ['roles'] });
    if (!permission) throw new NotFoundException('Permission introuvable');
    return permission;
      return permission
    } catch (error) {
      throw new NotFoundException(error)
    }
  }

  async findByRoleId(roleId: number) {
    const permissions = await this.permissionRepository.find({
      where: { roles: { id: roleId } },
      relations: ['role'],
    });
    return permissions.map((p) => p.action);
  }
  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      const categorie = await this.permissionRepository.findOne({
        where:{id:id}
      })
      if(!categorie) throw new NotFoundException('categorie')
      Object.assign(categorie, updatePermissionDto)
      return await this.permissionRepository.save(categorie)
    } catch (error) {
      throw new NotFoundException(error)
    }
  }

  async  remove(id: number) {
    try {
      const categorie = await this.permissionRepository.findOne({
        where: {id}
      });
      if(!categorie) throw new NotFoundException('user' );
  
      await this.permissionRepository.remove(categorie);
      return true
    } catch (error) {
      throw new NotFoundException(error)
    }
  }
  
}
