import { BadRequestException, HttpCode, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { AssignPermissionsDto } from 'src/role/dto/asignePermissionsDto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Roles } from 'src/role/entities/roles.entity';
import { Permissions } from 'src/permission/entities/permission.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { STATUS_CODES } from 'http';

@Injectable()
export class RolePermissionService {

    constructor(
      @InjectRepository(Roles)
      private readonly rolesRepository: Repository<Roles>,
      @InjectRepository(Permissions)
      private readonly permissionRepository: Repository<Permissions>,
    ){}


  create(createRolePermissionDto: CreateRolePermissionDto) {
    return 'This action adds a new rolePermission';
  }

  findAll() {
    return `This action returns all rolePermission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolePermission`;
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
    try {
      const role = await this.rolesRepository.findOne({
        where: { id: +dto.id },
        relations: ['permissions'],
      });
      if (!role) throw new NotFoundException('Rôle introuvable');
      if (!Array.isArray(dto.permissions)) {
        throw new BadRequestException("permissionIds doit être un tableau");
      }
      const newPermissions = await this.permissionRepository.findBy({id:In(dto.permissions)});
      if (!newPermissions) throw new NotFoundException('Rôle introuvable');
      role.nom = dto.nom;
      role.description = dto.description    
      role.permissions = await newPermissions
      await this.rolesRepository.save(role);
      return {status:HttpStatus.CREATED, message: "SUCCESS"}
    } catch (error) {
      console.log("erreur update",error);
      
      throw new ExceptionsHandler(error)
    }

  }
}
