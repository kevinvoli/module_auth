import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { TokenService } from '../jwt.service';
import { PermissionService } from 'src/permission/permission.service';
import { permission } from 'process';
import { RoleService } from 'src/role/role.service';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector, 
    private jwtService: TokenService,
    private roleService: RoleService,
  ) {
    super();
  }
  
   async canActivate(context: ExecutionContext) {
   
    try {
      const isPublic = this.reflector.getAllAndOverride('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
  
      if (isPublic) return true;
      
      const data = context.switchToRpc().getData();
      const token = data?.token;
      
      if (!token) {
        throw new RpcException({ status: 401, message: 'Token manquant' });
      }
      try {
        const decoded = await this.jwtService.verifyToken(token);
        
        let permissionss
    
        if (decoded?.roleId || decoded?.roleId!=0 ) {
          permissionss = await this.roleService.findByRoleId(decoded?.roleId)
        }
        const result= {
          user: decoded,
          permission:permissionss
        }
      // Retourner un nouvel objet contenant `user` dans les données

      context.getArgs()[0] = { ...data, user: result };
      
        return true;
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          throw new RpcException({ status: 401, message: 'Token expiré' });
        }
        throw new RpcException({ status: 401, message: 'Token invalide' });
      }
    ;
    } catch (error) {
      throw new RpcException({ status: 500, message: 'Erreur serveur' });
    }

    
  }
  
}
