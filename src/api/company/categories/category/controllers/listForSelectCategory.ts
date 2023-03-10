// # region IMPORTS
import { Request, Response } from 'express';
import { SharedCategoryServices } from '../../../../shared/categories/services/sharedCategoryServices';

// CLASS

const sharedCategoriesServices = new SharedCategoryServices();

// #endregion

export async function listForSelectCategory(req: Request, res: Response) {
  const categories = await sharedCategoriesServices.listForSelect({
    ownerCompanyId: req.Company.id,
  });

  return res.status(200).json(categories);
}
