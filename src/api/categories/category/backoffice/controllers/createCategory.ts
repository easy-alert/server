/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';

// CLASS

import { CategoryServices } from '../../services/categoryServices';
import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();
const categoryServices = new CategoryServices();

export async function createCategory(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const { name } = req.body;

  validator.notNull([{ label: 'nome da categoria', variable: name }]);

  const category = await categoryServices.create({ name });

  return res.status(200).json({
    category,
    ServerMessage: {
      statusCode: 201,
      message: 'Categoria cadastrada com sucesso.',
    },
  });
}
