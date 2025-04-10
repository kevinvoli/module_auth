import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import * as bcrypt from 'bcrypt';
import { Roles } from "src/role/entities/roles.entity";



@Index("email", ["email"], { unique: true })
@Index("role_id", ["roleId"], {})
@Entity("utilisateurs", { schema: "gestion_stock" })
export class Utilisateurs {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nom", length: 100 })
  name: string;

  @Column("varchar", { name: "email", unique: true, length: 100 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("int", { name: "role_id", nullable: true })
  roleId: number | null;

  @ManyToOne(() => Roles, (roles) => roles.utilisateurs, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Roles;

  @Column({select:true})
  salt: string;

  @Column({default:false})
  isAdmin:boolean;


  @CreateDateColumn({type:'datetime',  name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({type:'datetime', name: 'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({type:'datetime', name: 'delected_at'})
  delectedAt:Date;

    
  @BeforeInsert()
  private async hashPassword() {
  this.password = await bcrypt.hash(this.password,this.salt);
  }
  async validatePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword).then(result => {
      console.log("resultar");
      
      return result
    }).catch(erreur=>{
      return erreur
    })
  }

  async passwordHash(password:string) {
    const passwords = await bcrypt.hash(password,this.salt);
    return passwords
  }
}
