/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';

// CLASS

import { CategoryServices } from '../../services/categoryServices';
import { Validator } from '../../../../../utils/validator/validator';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

const validator = new Validator();
const categoryServices = new CategoryServices();

export async function createCategory(
  req: Request,
  _res: Response,
  _next: NextFunction,
) {
  const { name } = req.body;

  validator.notNull([{ label: 'nome da categoria', variable: name }]);

  await categoryServices.create({ name });

  throw new ServerMessage({
    statusCode: 201,
    message: 'Categoria cadastrada com sucesso.',
  });
}
