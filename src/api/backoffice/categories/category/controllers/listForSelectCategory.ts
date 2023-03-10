// # region IMPORTS
import { Request, Response } from 'express';
import { SharedCategoryServices } from '../../../../shared/categories/services/sharedCategoryServices';

// CLASS

const sharedCategoriesServices = new SharedCategoryServices();

// #endregion

export async function listForSelectCategoryBackoffice(_req: Request, res: Response) {
  const categories = await sharedCategoriesServices.listForSelectForBackoffice();

  return res.status(200).json(categories);
}
