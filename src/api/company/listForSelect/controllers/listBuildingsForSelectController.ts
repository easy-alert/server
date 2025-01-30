import { Request, Response } from 'express';

import { listBuildingsForSelect } from '../../../shared/listForSelect/services/listBuildingsForSelect';

export async function listBuildingsForSelectController(req: Request, res: Response) {
  const companyId = req.Company.id;

  const isAdmin = req.Permissions.some((permission) =>
    permission.Permission.name.includes('admin'),
  );

  const permittedBuildingsIds = req.BuildingsPermissions.map(
    (buildingPermission) => buildingPermission.Building.id,
  );

  const buildingsIds = isAdmin ? undefined : permittedBuildingsIds;

  const buildings = await listBuildingsForSelect({ companyId, buildingsIds });

  res.status(200).json({ buildings });
}
