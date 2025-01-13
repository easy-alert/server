import type { TPermissionsNames } from '../../../../types/TPermissionsNames';

export interface ICheckPermission {
  UserPermissions: { Permission: { name: string } }[];
  permissions: TPermissionsNames[];
}
