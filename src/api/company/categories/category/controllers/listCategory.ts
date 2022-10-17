import { Request, Response } from 'express';

// CLASS

import { CategoryServices } from '../services/categoryServices';

const categoryServices = new CategoryServices();

export async function listCategory(req: Request, res: Response) {
  const { search } = req.query;

  const categories = await categoryServices.list({
    search: search as string,
    ownerCompanyId: req.Company.id,
  });

  return res.status(200).json(categories);
}
