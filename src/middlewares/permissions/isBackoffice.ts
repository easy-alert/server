// TYPES
import { Response, Request, NextFunction } from 'express';

// CLASS
import { PermissionServices } from '../../api/shared/permission/services/permissionServices';

const permissionServices = new PermissionServices();

export const isBackoffice = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const permissions = req.Permissions;

  await permissionServices.checkPermission({
    UserPermissions: permissions,
    permission: 'Backoffice',
  });

  next();
};
