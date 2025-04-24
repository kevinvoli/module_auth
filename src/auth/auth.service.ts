import { ConflictException, HttpException, HttpStatus, Injectable, Logger, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { Token } from './entities/token.entity';
import { TokenService } from './jwt.service';

import * as speakeasy from 'speakeasy'
import { ConfigService } from '@nestjs/config';
import { CreateResetePasswordDto } from './dto/create-resete-pasword.dto';
import { CreateGoogleLoginDto } from './dto/create-googleLogin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';
import { Utilisateurs } from './entities/Utilisateurs.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/ligin-user.dto';

import { RoleService } from '../role/role.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(Utilisateurs)
    private readonly utilisateurRepository: Repository<Utilisateurs>,
    private tokenService : TokenService,
    private configService: ConfigService,
    private roleService: RoleService
  ) {}

  async googleLogin(email: CreateGoogleLoginDto){
    const payload = await this.utilisateurRepository.findOne({
      where:{email:email.email}
    })
    if (!payload) {
        throw new UnauthorizedException('Invalid credentials')
    }
    
    // console.log("ici mon token:",payload)
    const newToken = new Token()
    const accessToken =await this.tokenService.getAccessToken(payload)
    const refreshToken = await this.tokenService.getRefreshToken(payload)
    newToken.accessToken= accessToken
    newToken.refreshToken= refreshToken
    newToken.userId = payload.id
    await this.tokenRepository.save(newToken)
    const token= await this.tokenService.updateRefreshTokenInUser(newToken, payload.id)
    return {
      token:token,
      user:payload
    }
  }

  async create(createUserDto: CreateUserDto, idRole:number) {
    const {email, password,name} = createUserDto
    try { 
      const token = await this.tokenService.confirmationToken(createUserDto)  
      
      return token
    } catch (error) {
      // console.log("toujour des probleme")
      throw new HttpException(error, HttpStatus.BAD_REQUEST)

    }   
  }
  async validateUser(authDto: CreateAuthDto) {
    const {mail, password} = authDto
    try {
    //   const user = await this.userService.auth(mail)
    // if (user && user.validatePassword(password,user.password)) { 
    //   return user
    // }
    return null
    } catch (error) {
      throw new NotAcceptableException(error)
    } 
  }
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    let users = new Utilisateurs
    try {
      users= await this.utilisateurRepository.findOne({
      where: {email:email},
      relations:{
        role:true
      }
      })
      
      if(users && await users.validatePassword(password, users.password)){
        const payload = { email: users.email, id:users?.id, name:users.name, roleId: users.role?.id ? users.role.id :  0  } 
        if (!payload) {
          throw new UnauthorizedException('Invalid credentials')
        }
      
      const newToken = new Token()
      const accessToken =await this.tokenService.getAccessToken(payload)
      const refreshToken = await this.tokenService.getRefreshToken(payload)
      newToken.accessToken= accessToken
      newToken.refreshToken= refreshToken
      newToken.userId = payload.id
      const token= await this.tokenService.updateRefreshTokenInUser(newToken, payload.id)
      return {token:accessToken,user:payload}
      }
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    } catch (error) {

      throw new NotFoundException(error.message)  
    }    
  }


  async mailConfirmation(token:string){
    try {
      const users =  await this.tokenService.verifyToken(token)
      
      const newUser = new  Utilisateurs()
      newUser.password = users.password;
      newUser.name = users.name;
      newUser.email = users.email
      newUser.isAdmin = users?.isAdmin;
      newUser.salt = await bcrypt.genSalt();
      const result = await this.utilisateurRepository.save(newUser)
      console.log(result);
      return result

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Cet email est déjà utilisé');
      }
      throw new Error(error)
    }
  }

  async localLogout(userId: string): Promise<Utilisateurs> {
  try {
    const user = await this.utilisateurRepository.findOne({where:{id:+userId}});

  const token  = await this.tokenService.findOne(+userId)
  
  // if (!token) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
  token.refreshToken = 'null';
  token.accessToken= 'null';

  await this.tokenService.delete(token);
  return user
  } catch (error) {
    throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
  
  }

  async resetPasswordDemand( userMail: string){
    try {
      const users = await this.utilisateurRepository.findOne({
        where:{email:userMail}
      })
      if(!users) throw new NotFoundException('user not found')
        // genere un code pour la cofirmation
      const code = speakeasy.totp({
        secret: this.configService.get('RESETE_PASSWORD_CODE'),
        digits:5,
        step: 60*15,
        encoding:'base32'
      })
      const url = this.configService.get('RESETE_PASSWORD_URL')
     
      return {
        code: code,
        urlResetPassword: url
      }
    } catch (error) {
      throw new HttpException(error,HttpStatus.NOT_FOUND)
    }
  }

  async resetPasswordComfirmation(resetePasswordDto:CreateResetePasswordDto){
    try {
      const user = await this.utilisateurRepository.findOne({where:{email:resetePasswordDto.email}})
      if(!user)throw new NotAcceptableException('User not fund')
      const match =  speakeasy.totp.verify({
        secret: this.configService.get('RESETE_PASSWORD_CODE'),
        token:resetePasswordDto.code,
        digits:5,
        step: 60*15,
        encoding:'base32'
      })
      if(!match) throw new UnauthorizedException('Invalid/expired token')
      const hashpass= await user.passwordHash(resetePasswordDto.password)
      await this.utilisateurRepository.update(user.id,{password:hashpass})
      return  {data:"updated success"}
    } catch (error) {
      throw new HttpException(error,HttpStatus.NOT_FOUND)
    }
  }

  async findOne(userId){
    try {
      
      const users= await this.utilisateurRepository.findOne({
        where:{id:userId},
        relations:{role:true}
      })
      
      return users
    } catch (error) {
      throw new Error(error)
    }
  }

  async validateToken(token:string) {

    try {
      let permissionss 
      const result=  await this.tokenService.verifyToken(token)

      
      
      return permissionss
    } catch (error) {
      throw  new HttpException(error,HttpStatus.BAD_REQUEST)
    }
  }
}