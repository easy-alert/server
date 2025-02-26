import { Request, Response } from 'express';

import { listMaintenanceStatusForSelect } from '../../../shared/listForSelect/services/listMaintenanceStatusForSelect';

export async function listMaintenanceStatusForSelectController(_req: Request, res: Response) {
  // const companyId = req.Company.id;

  // const isAdmin = hasAdminPermission(req.Permissions);
  // const permittedBuildingsIds = handlePermittedBuildings(req.BuildingsPermissions, 'id');

  // const buildingsIds = isAdmin ? undefined : permittedBuildingsIds;

  const maintenanceStatus = await listMaintenanceStatusForSelect();

  res.status(200).json({ maintenanceStatus });
}
