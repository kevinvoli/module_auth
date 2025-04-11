import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { Utilisateurs } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/role/entities/roles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Utilisateurs)
  private readonly utilisateurRepository: Repository<Utilisateurs>,
  @InjectRepository(Roles)
      private readonly rolesRepository: Repository<Roles>,

  ){}
  async create(createUserDto: CreateUserDto) {
    const {email, password,name,roleId} = createUserDto
    try {
      const role= await this.rolesRepository.findOne({where:{id: createUserDto.roleId}})

      if (!role) {
        throw new NotFoundException("ce role n'existe pas")
      }
      const newUser = new  Utilisateurs()
      newUser.password = createUserDto.password;
      newUser.name = createUserDto.name;
      newUser.email = createUserDto.email
      newUser.role = role;
      newUser.salt = await bcrypt.genSalt();
      const result = await this.utilisateurRepository.save(newUser)
      console.log(result);
      return result

    } catch (error) {
      console.log("erruooscdvf=",error.code);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Cet email est déjà utilisé');
      }
      throw new Error(error)
    }
  }

  async findAll() {
    try {
      const users= await this.utilisateurRepository.find({
        relations:{
          role:true
        }
      })
      users.map(user=> {delete user.password,delete user.salt})
      return users
    } catch (error) {
      throw new  NotFoundException("utilisateur non trouve")
    }
  }

  async  findOne(id: number) {
    try {
      const users= await this.utilisateurRepository.findOne({
        where:{id},
        relations:{
          role:true
        }
      })
      return users
    } catch (error) {
      throw new  NotFoundException("utilisateur non trouve")
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const categorie = await this.utilisateurRepository.findOne({
        where:{id:id}
      })
      if(!categorie) throw new NotFoundException('categorie')
      Object.assign(categorie, updateUserDto)
      return await this.utilisateurRepository.save(categorie)
    } catch (error) {
      throw new NotFoundException(error)
    }
  }

  async  remove(id: number) {
    try {
      const categorie = await this.utilisateurRepository.findOne({
        where: {id}
      });
      if(!categorie) throw new NotFoundException('user' );
  
      await this.utilisateurRepository.delete({id});
      return true
    } catch (error) {
      throw new NotFoundException(error)
    }
  }
  
}
