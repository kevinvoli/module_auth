import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PolicyHandler } from '../interface/policies.interface';
import { CHECK_POLICIES_KEY } from '../decorators/policies.decorator';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly permissionServcie: PermissionService 

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

    if (!user) {
      throw new ForbiddenException("L'utilisateur n'est pas authentifié");
    }
    
    console.log(`azertyuikjhgvcx   result:`, user?.roleId);
    
    const permissions = await this.permissionServcie.findAllRole(user?.roleId)
    // Créer les permissions pour l'utilisateur
    console.log(`Permision   result:dzzsd`, permissions);
    
    const ability = await this.caslAbilityFactory.createForUser(permissions);
    console.log(`Handler  result:`, ability);

    handlers.forEach((handler, index) => {
        
      const result = handler(ability);
      console.log(`Handler ${index} result:`, result);
    });
    console.log("every handler: ", handlers.every((handler) => handler(ability)));
    
    // Vérifier les permissions en utilisant les handlers
    return handlers.every((handler) => handler(ability));
  }
}
