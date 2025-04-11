import { Module } from '@nestjs/common';
import { RessourceService } from './ressource.service';
import { RessourceController } from './ressource.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from 'src/permission/entities/permission.entity';
import { Roles } from 'src/role/entities/roles.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { EntityLoader } from 'src/casl/entity-loader.service';
import { Ressources } from './entities/ressource.entity';

@Module({
  imports:[    
      TypeOrmModule.forFeature([Ressources,Permissions,Roles]),
    ],
  controllers: [RessourceController],
  providers: [
    RessourceService,
    CaslAbilityFactory,
    EntityLoader
  ],
})
export class RessourceModule {}
