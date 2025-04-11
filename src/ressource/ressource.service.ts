import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRessourceDto } from './dto/create-ressource.dto';
import { UpdateRessourceDto } from './dto/update-ressource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action, Permissions } from 'src/permission/entities/permission.entity';
import { permission } from 'process';
import { Roles } from 'src/role/entities/roles.entity';
import { Ressources } from './entities/ressource.entity';

@Injectable()
export class RessourceService {
  constructor(
    @InjectRepository(Ressources)
    private readonly ressourceRepository: Repository<Ressources>,
    @InjectRepository(Permissions)
    private readonly permissionRepository: Repository<Permissions>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
 ){}
  async create(createRessourceDto: CreateRessourceDto) {
    try {
          const exists = await this.ressourceRepository.findOne({ where: { nom:createRessourceDto.nom } });
          if (exists) throw new BadRequestException('Cette ressource existe déjà');
      
          const role = this.rolesRepository.create(createRessourceDto);
          return this.rolesRepository.save(role);
        } catch (error) {
          
        }
  }

  async findAll() {
   try {
      const ligne = await this.ressourceRepository.find({
      relations:{permission:true}
      })
      return ligne
    } catch (error) {
      throw new HttpException("echec de la creation de article", HttpStatus.NOT_FOUND)

    } 
  }

  async findOne(id: number) {
    console.log("id role:", id);
    try {
      const role= await this.ressourceRepository.findOne({where:{id: id},relations:{permission:true}})
      if (!role) throw new NotFoundException('Rôle non trouvé');
      return role
    } catch (error) {
      console.log("error role:", error);
      
      return error
    }
  }

 async update(id: number, updateRoleDto: UpdateRessourceDto) {
     try {
       const categorie = await this.ressourceRepository.findOne({
         where:{id:id}
       })
       if(!categorie) throw new NotFoundException('categorie')
       Object.assign(categorie, updateRoleDto)
       return await this.ressourceRepository.save(categorie)
     } catch (error) {
       throw new NotFoundException(error)
     }
   }
 
   async remove(id: number) {
     try {
       const categorie = await this.ressourceRepository.findOne({
         where: {id}
       });
       if(!categorie) throw new NotFoundException('user' );
   
       await this.ressourceRepository.delete({id});
       return true
     } catch (error) {
       throw new NotFoundException(error)
     }
   }




  // async addPermission() {
  //   try {
  //     const action = Action
  //     const allRessource:Ressource[]= await this.ressourceRepository.find()
  //     console.log("toute les resource", allRessource);
  //     allRessource.forEach(async (ressource)=>{
  //       for (let i = 0; i < 4; i++) {
  //         const permission = new Permissions()
  //         if (i===0) {
  //           permission.action = action.Create
  //           permission.nom = `Create ${ressource.nom}`
  //           permission.ressource = ressource
  //         }
  //         if (i===1) {
  //           permission.action = action.Delete
  //           permission.nom = `Delete ${ressource.nom}`
  //           permission.ressource = ressource
  //         }
  //         if (i===2) {
  //           permission.action = action.Read
  //           permission.nom = `Read ${ressource.nom}`
  //           permission.ressource = ressource
  //         }
  //         if (i===3) {
  //           permission.action = action.Update
  //           permission.nom = `Update ${ressource.nom}`
  //           permission.ressource = ressource
  //         }
  //         await this.permissionRepository.save(permission)
  //       }
  //     })
  //     return allRessource
  //   } catch (error) {
  //     throw new NotFoundException(error)
  //   }
  // }

  // async addPermissionSuperAdmin(){
  //   try {
  //     const role :Roles = await this.rolesRepository.findOne({ where: { id: 2 	 }, relations: ['permissions'] });
  //   if (!role) throw new NotFoundException('Rôle introuvable');
  //     console.log("les role superadmin:",role);
      
  //   const allpermissions: Permissions[] = await this.permissionRepository.find();
  //   allpermissions.forEach((permissionss)=>{
  //     role.permissions.push(permissionss) ;
  //   })
  //   console.log("les role superadmin:",role);
  //   return await this.rolesRepository.save(role);
  //   } catch (error) {
      
  //   }
  // }
}
