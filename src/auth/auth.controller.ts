import { Body, ClassSerializerInterceptor, Controller, Post, Res, UseGuards, UseInterceptors,Request, Get, Param, Delete, Query, ConflictException, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginUserDto } from './dto/ligin-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateResetePasswordDto } from './dto/create-resete-pasword.dto';
import { CheckPolicies } from 'src/casl/decorators/policies.decorator';
import { Action } from 'src/permission/entities/permission.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


  @Controller('auth')
  @UseInterceptors(ClassSerializerInterceptor)
  export class AuthController {
  
    constructor(private readonly authService: AuthService) {}
  
    @Post('register')
    async register(@Body() createAuthDto: CreateUserDto, idRole:number=1) {
      
      const users= await this.authService.create(createAuthDto, idRole);
      console.log('moi aaussi',createAuthDto);
  
      return users
    }

    @MessagePattern({cmd: 'login_auth'})
      async login(@Payload() user: LoginUserDto) {
        console.log("debut de la connexion:",user);
        
        const result= await this.authService.login(user);
        console.log("result connexion:",result);

        return {token: result.token, status:200, user: result.user}
      }
      
    @MessagePattern({cmd: 'create_auth'})
    async registerUser(data:CreateUserDto) {
      try {
        console.log("ceate ok", data);
        const idRole:number=1
        const result= await this.authService.create(data,idRole);
  
        return result
      } catch (error) {
        return error
      }
     
    }
   
  
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request()  req, @Res({passthrough:true}) respons:Response){
      respons.clearCookie('jwt')
      
      const result= await this.authService.localLogout(req.user)
      console.log("cococococococococococococococococococococo", result);
      return result
    }
  
  
    // @Get('confirmation/:token')
    // async  mailconfirmation(@Param('token')token:string){
    //   try {
    //     console.log(token);
    //     const confirmation = await this.authService.mailConfirmation(token)
    //     console.log(confirmation);
    //     return confirmation
    //   } catch (error) {
    //     throw new Error(error)
    //   }
     
    // }

    @MessagePattern({cmd: 'confirmation_auth'})
    async mailConfirmation(data:any) {
      try {
        const token = data.tokens
        console.log("mes token",token);
        
        const result= await this.authService.mailConfirmation(token);
      console.log("debut de la connexion:",result);

      return result
      } catch (error) {
        if (error.status === 409) {
    
        throw new RpcException(new ConflictException('Cet email est déjà utilisé'));
        }
      
        throw new Error(error.response)
      }
      
    }
  
    @Post('resete-password')
    async resetePassword(@Body()user:UpdateUserDto, @Res({passthrough:true}) respons:Response){
      respons.clearCookie('jwt')
      console.log("cococococococococococococococococococococo");
      const result= await this.authService.resetPasswordDemand(user.email)
      return result
    }
  
    @Post('reset-password-confirmation')
    async resetePasswordConfirm(@Body()code:CreateResetePasswordDto, @Res({passthrough:true}) respons:Response){
      respons.clearCookie('jwt')
      console.log("cococococococococococococococococococococo");
      
      const result= await this.authService.resetPasswordComfirmation(code)
      console.log("cococococococococococococococococococococo", result);
  
      return result
    }
  

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtAuthGuard)
    @CheckPolicies(
       (ability) => ability.can(Action.Read, 'Utilisateurs'),
      (ability) => ability.can(Action.Create, 'Utilisateurs'),
      (ability) => ability.can(Action.Update, 'Utilisateurs'),
    )
    @Delete('delete')
    async deleteAccount(@Request()  req,){
      console.log("ma request", req.user);
      
      return req?.user
    }


    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtAuthGuard)
    @MessagePattern({cmd:'validate_token'})
    async validateToken(@Payload() data: any) {  
      try {
        console.log("les data", data);
      
      return data.user;
      } catch (error) {
      console.log("les error:",error);
        return error
      }    
    }
    
  }

