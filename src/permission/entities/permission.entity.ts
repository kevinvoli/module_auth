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

  @Column("varchar", { name: "module", nullable: false, length: 50 })
  module: string ;

  @Column({type:"enum", enum: Action, nullable: false, default: Action.Read, enumName: 'action_enum'})
  action: Action;

  @Column({ type: 'json', nullable: true })
  conditions: Record<string, any>;

  @ManyToMany(() => Roles, (role) => role.permissions)
  roles: Roles[];
  
}
