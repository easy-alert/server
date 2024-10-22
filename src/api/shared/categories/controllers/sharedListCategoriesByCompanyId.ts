import { Request, Response } from 'express';

import { SharedCategoryServices } from '../services/sharedCategoryServices';

const sharedCategoryServices = new SharedCategoryServices();

export async function sharedListCategoriesByCompanyId(req: Request, res: Response) {
  const { defaultCategories, companyCategories } = await sharedCategoryServices.listByCompanyId(
    req.params.companyId,
  );

  // Concatenate categories, remove duplicates and sort by name
  const allCategories = [...defaultCategories, ...companyCategories]
    .filter((category, index, self) => index === self.findIndex((t) => t.name === category.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  return res.status(200).json({ allCategories, defaultCategories, companyCategories });
}
