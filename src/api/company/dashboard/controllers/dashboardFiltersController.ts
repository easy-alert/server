/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';
import { dashboardServices } from '../services/dashboardServices';

import { hasAdminPermission } from '../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../utils/permissions/handlePermittedBuildings';

export async function dashboardFiltersController(req: Request, res: Response) {
  const isAdmin = hasAdminPermission(req.Permissions);
  const permittedBuildingsIds = handlePermittedBuildings(req.BuildingsPermissions, 'id');

  const buildingsIds = isAdmin ? undefined : permittedBuildingsIds;

  const { buildingsData, categoriesData } = await dashboardServices.dashboardFilters({
    buildingsIds,
    companyId: req.Company.id,
  });

  let buildings: string[] = [];
  let responsible: string[] = [];
  let categories: string[] = [];

  buildingsData.forEach((building) => {
    buildings.push(building.name);
  });

  buildings = [...new Set(buildings)].sort((a, b) => a.localeCompare(b));
  responsible = [...new Set(responsible)].sort((a, b) => a.localeCompare(b));
  categories = [
    ...new Set(categoriesData.map((category) => category.Maintenance.Category.name)),
  ].sort((a, b) => a.localeCompare(b));

  return res.status(200).json({ buildings, responsible, categories });
}
