import { Request, Response } from 'express';

import { PermissionServices } from '../../../../shared/permissions/permission/services/permissionServices';

const permissionServices = new PermissionServices();

export async function getAllPermissionsController(req: Request, res: Response) {
  const { adminPermissions } = req.query;

  const parsedAdminPermissions = adminPermissions === 'true';

  const permissions = await permissionServices.getAllPermissions({
    adminPermissions: parsedAdminPermissions,
  });

  const modules: { moduleName: string; moduleLabel: string }[] = [];

  permissions.forEach((permission) => {
    if (!modules.find((module) => module.moduleName === permission.moduleName)) {
      modules.push({
        moduleName: permission.moduleName || '',
        moduleLabel: permission.moduleLabel || '',
      });
    }
  });

  return res.status(200).json({ permissions, modules });
}
