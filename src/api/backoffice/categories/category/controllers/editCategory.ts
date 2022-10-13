/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response } from 'express';

// CLASS

import { CategoryServices } from '../services/categoryServices';
import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();
const categoryServices = new CategoryServices();

export async function editCategory(req: Request, res: Response) {
  const { categoryId, name } = req.body;

  validator.notNull([
    { label: 'ID da categoria', variable: categoryId },
    { label: 'nome da categoria', variable: name },
  ]);

  await categoryServices.edit({ name, categoryId });

  return res
    .status(200)
    .json({ statusCode: 201, message: 'Categoria editada com sucesso.' });
}
