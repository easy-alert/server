import { Request, Response } from 'express';

import { getUserBuildingsPermissionsById } from '../../../../shared/permissions/userBuildingsPermissions/services/getUserBuildingsPermissionsById';

export async function getUserBuildingsPermissionsByIdController(req: Request, res: Response) {
  const { userId } = req.params;
  const { companyId } = req.query;

  const parsedUserId = userId ? (userId as string) : undefined;
  const parsedCompanyId = companyId ? (companyId as string) : undefined;

  const permissions = await getUserBuildingsPermissionsById({
    companyId: parsedCompanyId,
    userId: parsedUserId,
  });

  return res.status(200).json({ userBuildingsPermissions: permissions });
}
