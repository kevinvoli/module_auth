import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreatePermissionDto {
  @IsNotEmpty()
  action: string;

  @IsNotEmpty()
  resource: string;

  @IsNotEmpty()
  conditions: Record<string, any>;
  
  isAdmin: boolean | null; 
}


