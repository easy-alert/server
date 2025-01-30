import { Request, Response } from 'express';

import { listBuildingsForSelect } from '../../../shared/listForSelect/services/listBuildingsForSelect';
import { hasAdminPermission } from '../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../utils/permissions/handlePermittedBuildings';

export async function listBuildingsForSelectController(req: Request, res: Response) {
  const companyId = req.Company.id;

  const isAdmin = hasAdminPermission(req.Permissions);
  const permittedBuildingsIds = handlePermittedBuildings(req.BuildingsPermissions, 'id');

  const buildingsIds = isAdmin ? undefined : permittedBuildingsIds;

  const buildings = await listBuildingsForSelect({ companyId, buildingsIds });

  res.status(200).json({ buildings });
}
