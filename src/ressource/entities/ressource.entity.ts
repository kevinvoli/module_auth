import { Permissions } from "src/permission/entities/permission.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


@Entity("ressources", { schema: "gestion_stock" })
export class Ressources {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nom", nullable: false, length: 50, unique:true })
  nom: string ;

  @Column("varchar", { name: "service_name", nullable: false, length: 50,  })
  serviceName: string ;

  @OneToMany(() => Permissions, (permission) => permission.ressource)
  permission: Permissions[];
  
}
