import { Request, Response } from 'express';

// CLASS

import { Validator } from '../../../../../utils/validator/validator';
import { SharedCategoryServices } from '../services/sharedCategoryServices';

const validator = new Validator();
const sharedCategoryServices = new SharedCategoryServices();

export async function editCategory(req: Request, res: Response) {
  const { categoryId, name } = req.body;

  validator.notNull([
    { label: 'ID da categoria', variable: categoryId },
    { label: 'nome da categoria', variable: name },
  ]);

  await sharedCategoryServices.edit({ name, categoryId });

  return res
    .status(200)
    .json({ statusCode: 201, message: 'Categoria editada com sucesso.' });
}
