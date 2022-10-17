// TYPES
import { Response, Request, NextFunction } from 'express';

// CLASS
import { PermissionServices } from '../../api/shared/permission/services/permissionServices';

const permissionServices = new PermissionServices();

export const isCompany = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const permissions = req.Permissions;

  await permissionServices.checkPermission({
    UserPermissions: permissions,
    permission: 'Company',
  });

  next();
};
