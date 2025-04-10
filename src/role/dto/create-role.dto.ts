import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length, isNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  description: string;
  
}



