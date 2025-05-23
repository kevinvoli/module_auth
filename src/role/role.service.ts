import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { In, Repository } from 'typeorm';
import { Permissions } from 'src/permission/entities/permission.entity';
import { AssignPermissionsDto } from './dto/asignePermissionsDto';
import { permission } from 'process';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(Permissions)
    private readonly permissionRepository: Repository<Permissions>,
  ){}


  async create(createRoleDto: CreateRoleDto) {
    try {
      const exists = await this.rolesRepository.findOne({ where: { nom:createRoleDto.name } });
      if (exists) throw new BadRequestException('Ce rôle existe déjà');
  
      const role = this.rolesRepository.create(createRoleDto);
      return this.rolesRepository.save(role);
    } catch (error) {
      
    }
  }

  async findAll() {
    try {
      const ligne = await this.rolesRepository. find({
       relations:{permissions:true}
      })
      return ligne
    } catch (error) {
      throw new HttpException("echec de la creation de article", HttpStatus.NOT_FOUND)

    }  
  }

  async findOne(id: number) {
    console.log("id role:", id);
    try {
      const role= await this.rolesRepository.findOne({where:{id: id},relations:{permissions:true}})
      if (!role) throw new NotFoundException('Rôle non trouvé');
      return role
    } catch (error) {
      console.log("error role:", error);
      
      return error
    }
    
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const categorie = await this.rolesRepository.findOne({
        where:{id:id}
      })
      if(!categorie) throw new NotFoundException('categorie')
      Object.assign(categorie, updateRoleDto)
      return await this.rolesRepository.save(categorie)
    } catch (error) {
      throw new NotFoundException(error)
    }
  }

  async remove(id: number) {
    try {
      const categorie = await this.rolesRepository.findOne({
        where: {id}
      });
      if(!categorie) throw new NotFoundException('user' );
  
      await this.rolesRepository.delete({id});
      return true
    } catch (error) {
      throw new NotFoundException(error)
    }
  }

  async assignPermissions(dto: AssignPermissionsDto) {
    const role = await this.rolesRepository.findOne({ where: { id: +dto.id}, relations: ['permissions'] });
    if (!role) throw new NotFoundException('Rôle introuvable');

    const permissions = await this.permissionRepository.findByIds(dto.permissions);
    role.permissions = permissions;

    return await this.rolesRepository.save(role);
  }

  async findByRoleId(roleId: number): Promise<Permissions[]> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
  
    if (!role) {
      throw new NotFoundException('Rôle non trouvé');
    }
  
    return role.permissions;
  }

  async removePermissions(dto: AssignPermissionsDto) {
    const role = await this.rolesRepository.findOne({
      where: { id: +dto.id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Rôle introuvable');
  
    role.permissions = role.permissions.filter(p => !dto.permissions.includes(p.id));
    return await this.rolesRepository.save(role);
  }

  async addPermissions( dto: AssignPermissionsDto) {
    const role = await this.rolesRepository.findOne({
      where: { id: +dto.id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Rôle introuvable');
  
    const newPermissions = await this.permissionRepository.findBy({id:In(dto.permissions)});
  

    if (!newPermissions) throw new NotFoundException('Rôle introuvable');

    role.permissions = await newPermissions
    // const existingIds = new Set(role.permissions.map(p => p.id));
    // const permissionsToAdd = newPermissions.filter(p => !existingIds.has(p.id));
  
    // role.permissions = [...role.permissions, ...permissionsToAdd];
    return await this.rolesRepository.save(role);
  }
  
  
}
