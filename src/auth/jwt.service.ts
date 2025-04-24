import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from './interface/payload.interface';
import * as bcrypt from 'bcrypt';
import { TokenExpiredError } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { CreateUserDto } from './dto/create-user.dto';
import { Payload } from '@nestjs/microservices';
import { RoleService } from 'src/role/role.service';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class TokenService{
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private jwtService:JwtService,
    private configService: ConfigService,
  ){}  
  async confirmationToken(data:CreateUserDto){
    
    const Payload= {
      email: data.email,
      password: data.password,
      name: data.name,
      
    }
    try {
      const confirmation = await this.jwtService.sign(data, {
        secret: this.configService.get('SECRET'),
        expiresIn: 360555555
    })
    
      return confirmation
    } catch (error) {
      return error
    }
 
  }


  async getAccessToken(payload: PayloadInterface) {
    const accessToken = await this.jwtService.sign(payload, {
        secret: this.configService.get('SECRET'),
        expiresIn: 360555555
    })
    return accessToken
  }

  async getRefreshToken(payload: PayloadInterface) {
    const refreshToken = await this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: 360555555
    })
    return refreshToken
  }
  async updateRefreshTokenInUser(refreshToken: Partial<Token>, userId) {
    try {
      let userToken= await this.tokenRepository.findOne({
        where:{userId:userId}
      })
      if (!userToken) {
        let newToken = await this.tokenRepository.create()
        newToken.userId = userId
        userToken= await this.tokenRepository.save(newToken)
      }
      refreshToken.refreshToken = await bcrypt.hash(refreshToken.refreshToken, 10)
      const up= await this.tokenRepository.update(userToken.id,refreshToken)
       return  userToken.accessToken
    } catch (error) {
      throw new HttpException(error,HttpStatus.NOT_FOUND)
    }
    return false
  }

  async getNewAccessAndRefreshToken(payload: PayloadInterface) {
    try {
      const refreshToken = await this.getRefreshToken(payload)
    let data = {
      refreshToken:refreshToken
    }
    await this.updateRefreshTokenInUser(data, payload.id)
    return {
        accessToken: await this.getAccessToken(payload),
        refreshToken: refreshToken
    }
    } catch (error) {
      throw new HttpException(error,HttpStatus.NOT_FOUND)
    } 
  }

  async verifyToken(token){
    try {
      
      const confirmation= await this.jwtService.verify(token,{
        secret: this.configService.get('SECRET'),
      })   
      return confirmation
    } catch (error) {
      throw  new HttpException(error,HttpStatus.BAD_REQUEST)
    }
  }

  async findOne(userId:number){
    
    try {
      const token = await this.tokenRepository.findOne({
        where:{
          userId:userId
        },
        loadRelationIds:true
      })
      return token
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND)
    }
  }
  async save(token:Token){
    try {
      return await this.tokenRepository.update(token.id,token)
    } catch (error) {
      throw new HttpException(error,HttpStatus.BAD_REQUEST)
    }
  }

  async delete(token:Token){
    try {
      const result= await this.tokenRepository.delete(token.id)
    return result
    } catch (error) {
      throw new HttpException(error,HttpStatus.BAD_REQUEST)
    }
  }
}