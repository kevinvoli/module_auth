import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Action } from "../entities/permission.entity";

export class CreatePermissionDto {
  @IsNotEmpty()
  action: Action;

  @IsNotEmpty()
  module: string;

  @IsNotEmpty()
  conditions?: string;

}


