import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PolicyHandler } from '../interface/policies.interface';
import { CHECK_POLICIES_KEY } from '../decorators/policies.decorator';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { PermissionService } from 'src/permission/permission.service';
import { RoleService } from '../../role/role.service';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly rolesServcie: RoleService 

  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];
    
    const request = context.switchToHttp().getRequest();
    // console.log("les user", request.user);
    
    const user = request.user;
    console.log(`azertyuikjhgvcx   result:`, request);


    if (!user) {
      throw new ForbiddenException("L'utilisateur n'est pas authentifié");
    }
    
  
    
    const permissions = await this.rolesServcie.findByRoleId(user?.roleId)
    // Créer les permissions pour l'utilisateur
    console.log(`Permision   result:dzzsd`, permissions);
    
    const ability = await this.caslAbilityFactory.createForUser(permissions);
    console.log(`Handler  result:`, ability);

    handlers.forEach((handler, index) => {
        
      const result = handler(ability);
      console.log(`Handler ${index} result:`, result);
    });

    
    // Vérifier les permissions en utilisant les handlers
    return handlers.every((handler) => handler(ability));
  }
}
