import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/role/entities/roles.entity';
export const ROLES_KEY = 'roles';
export const Role = (...roles: Roles[]) =>SetMetadata(ROLES_KEY, roles);