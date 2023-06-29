// #region IMPORTS
import { Request, Response } from 'express';
import { BuildingReportsServices } from '../services/buildingReportsServices';

// CLASS
const buildingReportsServices = new BuildingReportsServices();

// #endregion

export async function listForSelectBuildingReports(req: Request, res: Response) {
  const { filters } = await buildingReportsServices.findForSelectFilterOptions({
    companyId: req.Company.id,
  });

  const categories: { id: string; name: string }[] = [];

  filters.categories.forEach((categoryData) => {
    const categoryFound = categories.find((category) => category.name === categoryData.name);

    if (!categoryFound) {
      categories.push({
        id: categoryData.id,
        name: categoryData.name,
      });
    }
  });

  filters.categories = categories;

  return res.status(200).json({ filters });
}
