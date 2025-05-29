import { Request, Response } from 'express';

import { findCompanyByUserId } from '../../../shared/company/services/findCompanyByUserId';
import { findCompanyByBuildingId } from '../../../shared/company/services/findCompanyByBuildingId';

import { listMaintenanceCategoriesForSelect } from '../../../shared/listForSelect/services/listMaintenanceCategoriesForSelect';

interface IQueryParams {
  companyId?: string;
  buildingId?: string;
  userId?: string;
}

export async function listMaintenanceCategoriesForSelectController(req: Request, res: Response) {
  const { Company } = req;
  const { companyId: qCompanyId, buildingId, userId } = req.query as IQueryParams;

  let companyId = qCompanyId || Company?.id || req.companyId;

  if (!companyId) {
    let company = null;

    if (buildingId) {
      // If buildingId is provided, find the company by buildingId
      company = await findCompanyByBuildingId({ buildingId });
    } else if (userId) {
      // If userId is provided, find the company by userId
      company = await findCompanyByUserId({ userId });
    } else {
      // If neither is provided, return an error
      return res
        .status(400)
        .json({ message: 'É necessário fornecer um ID de edificação ou de usuário' });
    }

    if (!company) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
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
