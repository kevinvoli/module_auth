import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRessourceDto {
  @IsNotEmpty()
  @IsString()
  nom: string ;

  @IsString()
  @IsOptional()
  serviceName: string ;
}
