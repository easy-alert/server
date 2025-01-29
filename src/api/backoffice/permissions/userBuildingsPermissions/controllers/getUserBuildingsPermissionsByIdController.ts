import { Request, Response } from 'express';

import { getUserBuildingsPermissionsById } from '../../../../shared/permissions/userBuildingsPermissions/services/getUserBuildingsPermissionsById';

export async function getUserBuildingsPermissionsByIdController(req: Request, res: Response) {
  const { userId } = req.params;

  const parsedUserId = userId ? (userId as string) : undefined;

  const permissions = await getUserBuildingsPermissionsById({ userId: parsedUserId });

  return res.status(200).json({ userBuildingsPermissions: permissions });
}
