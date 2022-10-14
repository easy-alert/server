import { Request, Response } from 'express';

// CLASS

import { CategoryServices } from '../services/categoryServices';
import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();
const categoryServices = new CategoryServices();

export async function deleteCategory(req: Request, res: Response) {
  const { categoryId } = req.body;

  validator.notNull([{ label: 'ID da categoria', variable: categoryId }]);

  await categoryServices.delete({ categoryId });

  return res.status(200).json({
    statusCode: 201,
    message: 'Categoria excluída com sucesso.',
  });
}
