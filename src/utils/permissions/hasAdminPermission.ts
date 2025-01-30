import { Request } from 'express';

export function hasAdminPermission(permissions: Request['Permissions']): boolean {
  if (!permissions) {
    return false;
  }

  return permissions.some((permission) => permission.Permission.name.includes('admin'));
}
