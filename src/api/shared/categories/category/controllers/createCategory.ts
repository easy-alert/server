/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response } from 'express';

// CLASS

import { Validator } from '../../../../../utils/validator/validator';
import { SharedCategoryServices } from '../services/sharedCategoryServices';

const validator = new Validator();
const sharedCategoryServices = new SharedCategoryServices();

export async function createCategory(req: Request, res: Response) {
  const { name, ownerCompanyId } = req.body;

  validator.notNull([{ label: 'nome da categoria', variable: name }]);

  const category = await sharedCategoryServices.create({
    name,
    ownerCompanyId,
  });

  return res.status(200).json({
    category,
    ServerMessage: {
      statusCode: 201,
      message: 'Categoria cadastrada com sucesso.',
    },
  });
}
