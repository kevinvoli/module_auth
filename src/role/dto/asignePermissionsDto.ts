import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AssignPermissionsDto {
  
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  id:Number

  @IsString()
  @IsOptional()
  nom:string

  @IsString()
  @IsOptional()
  description:string

  @IsInt()
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  permissions: number[];
}