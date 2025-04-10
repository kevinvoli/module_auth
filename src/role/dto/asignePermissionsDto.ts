import { IsInt } from "class-validator";

export class AssignPermissionsDto {
  @IsInt()
  permissionIds: number[];
}