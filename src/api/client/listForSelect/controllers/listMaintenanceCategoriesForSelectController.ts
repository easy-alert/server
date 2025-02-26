import { Request, Response } from 'express';

import { listMaintenanceCategoriesForSelect } from '../../../shared/listForSelect/services/listMaintenanceCategoriesForSelect';
import { findCompanyByUserId } from '../../../shared/company/services/findCompanyByUserId';

export async function listMaintenanceCategoriesForSelectController(req: Request, res: Response) {
  const { userId } = req.query as { userId: string };
  const { Company } = req;

  let companyId = Company?.id;

  if (!companyId && userId) {
    const company = await findCompanyByUserId({ userId });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    companyId = company.id;
  }

  // const isAdmin = hasAdminPermission(req.Permissions);
  // const permittedBuildingsIds = handlePermittedBuildings(req.BuildingsPermissions, 'id');

  // const buildingsIds = isAdmin ? undefined : permittedBuildingsIds;

  const maintenanceCategories = await listMaintenanceCategoriesForSelect({ companyId });

  // const formattedCategories = maintenanceCategories.map((category) => ({
  //   id: category.Category.id,
  //   name: category.Category.name,
  // }));

  return res.status(200).json({ maintenanceCategories });
}
