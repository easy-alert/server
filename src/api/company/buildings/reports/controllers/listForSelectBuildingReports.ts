// #region IMPORTS
import { Request, Response } from 'express';
import { BuildingReportsServices } from '../services/buildingReportsServices';

// CLASS
const buildingReportsServices = new BuildingReportsServices();

// #endregion

export async function listForSelectBuildingReports(req: Request, res: Response) {
  const filters = await buildingReportsServices.findForSelectFilterOptions({
    companyId: req.Company.id,
  });

  return res.status(200).json(filters);
}
