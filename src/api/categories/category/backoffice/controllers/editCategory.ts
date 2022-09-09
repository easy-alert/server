/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';

// CLASS

import { CategoryServices } from '../../services/categoryServices';
import { Validator } from '../../../../../utils/validator/validator';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

const validator = new Validator();
const categoryServices = new CategoryServices();

export async function editCategory(
  req: Request,
  _res: Response,
  _next: NextFunction,
) {
  const { categoryId, name } = req.body;

  validator.notNull([
    { label: 'ID da categoria', variable: categoryId },
    { label: 'nome da categoria', variable: name },
  ]);

  await categoryServices.edit({ name, categoryId });

  throw new ServerMessage({
    statusCode: 201,
    message: 'Categoria editada com sucesso.',
  });
}
