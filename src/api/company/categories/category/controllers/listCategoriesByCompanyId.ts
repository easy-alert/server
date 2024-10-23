/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';

// CLASS

import { CategoryServices } from '../services/categoryServices';

const categoryServices = new CategoryServices();

export async function listCategoriesByCompanyId(req: Request, res: Response) {
  const { defaultCategories, companyCategories } = await categoryServices.listByCompanyId(
    req.Company.id,
  );

  // Concatenate categories, remove duplicates and sort by name
  const allCategories = [...defaultCategories, ...companyCategories]
    .filter((category, index, self) => index === self.findIndex((t) => t.name === category.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  return res.status(200).json({ allCategories, defaultCategories, companyCategories });
}
