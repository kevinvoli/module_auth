import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length, isNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  
  
}



