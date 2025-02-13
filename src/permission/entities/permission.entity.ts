import { Roles } from "src/role/entities/roles.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum Action {
  Read = 'read',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

@Index("role_id", ["roleId"], {})
@Entity("permissions", { schema: "gestion_stock" })
export class Permissions {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "role_id", nullable: true })
  roleId: number | null;

  @Column("varchar", { name: "module", nullable: false, length: 50 })
  module: string ;

  @Column({type:"enum", enum: Action, nullable: false, default: Action.Read, enumName: 'action_enum'})
  action: Action;

  @Column({ type: 'json', nullable: true })
  conditions: Record<string, any>;

  @ManyToOne(() => Roles, (roles) => roles.permissions, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })

  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Roles;
  
}
