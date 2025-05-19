import { Request, Response } from 'express';

import { getUserPermissionsById } from '../../../../shared/permissions/userPermissions/services/getUserPermissionsById';

export async function getUserPermissionsByIdController(req: Request, res: Response) {
  const { userId } = req.params;
  const { companyId } = req.query;

  const parsedUserId = userId ? (userId as string) : undefined;
  const parsedCompanyId = companyId ? (companyId as string) : undefined;

  const permissions = await getUserPermissionsById({
    companyId: parsedCompanyId,
    userId: parsedUserId,
  });

  const formattedPermissions = permissions.map((permission) => ({
    id: permission.Permission.id,
    name: permission.Permission.name,
  }));

  return res.status(200).json({ userPermissions: formattedPermissions });
}
