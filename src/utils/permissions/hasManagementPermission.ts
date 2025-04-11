import { Request } from 'express';

import type { TPermissionsNames } from '../../types/TPermissionsNames';

type ManagementPermissions = Extract<TPermissionsNames, `management:${string}`>;

export function hasManagementPermission(
  permissions: Request['Permissions'],
  managementPermission: ManagementPermissions,
): boolean {
  if (!permissions) {
    return false;
  }

  return permissions.some((permission) =>
    permission.Permission.name.includes(managementPermission),
  );
}
