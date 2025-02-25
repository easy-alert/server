import { Request, Response } from 'express';

import { listMaintenanceCategoriesForSelect } from '../../../shared/listForSelect/services/listMaintenanceCategoriesForSelect';

export async function listMaintenanceCategoriesForSelectController(req: Request, res: Response) {
  const companyId = req.Company.id;

  // const isAdmin = hasAdminPermission(req.Permissions);
  // const permittedBuildingsIds = handlePermittedBuildings(req.BuildingsPermissions, 'id');

  // const buildingsIds = isAdmin ? undefined : permittedBuildingsIds;

  const maintenanceCategories = await listMaintenanceCategoriesForSelect({ companyId });

  // const formattedCategories = maintenanceCategories.map((category) => ({
  //   id: category.Category.id,
  //   name: category.Category.name,
  // }));

  res.status(200).json({ maintenanceCategories });
}
