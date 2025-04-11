import { Ressources } from "src/ressource/entities/ressource.entity";
import { Roles } from "src/role/entities/roles.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum Action {
  Read = 'read',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}


@Entity("permissions", { schema: "gestion_stock" })
export class Permissions {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;
  @Column("varchar", { name: "nom", nullable: false, length: 50 })
  nom: string ;

  @Column("varchar", { name: "ressourceName", nullable: false, length: 50 })
  module: string ;

  @Column({type:"enum", enum: Action, nullable: false, default: Action.Read, enumName: 'action_enum'})
  action: Action;

  @Column({ type: 'text', nullable: true })
  conditions: string;

  @ManyToMany(() => Roles, (role) => role.permissions)
  roles: Roles[];
  
  @ManyToOne(() => Ressources, (ressource) => ressource.permission, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "ressourceName", referencedColumnName: "nom" }])
  ressource: Ressources;
  
}
