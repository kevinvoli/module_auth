import { Utilisateurs } from "src/auth/entities/Utilisateurs.entity";
import { Permissions } from "src/permission/entities/permission.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("roles", { schema: "gestion_stock" })
export class Roles {
  @PrimaryGeneratedColumn({ type: "int", name: "id",})
  id: number;

  @Column("varchar", { name: "nom", length: 50 , unique:true })
  nom: string;

  @Column("varchar", { name: "description", nullable: true })
  description: string | null;

  @CreateDateColumn({type:'datetime',  name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({type:'datetime', name: 'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({type:'datetime', name: 'delected_at'})
  delectedAt:Date;

  @OneToMany(() => Permissions, (permissions) => permissions)
  permissions: Permissions[];

  @OneToMany(() => Utilisateurs, (utilisateurs) => utilisateurs.role)
  utilisateurs: Utilisateurs[];
}


