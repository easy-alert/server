/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

// TYPES
import { Request, Response } from 'express';

// CLASS

import { Validator } from '../../../../../utils/validator/validator';
import { CompanyServices } from '../services/companyServices';

const validator = new Validator();
const companyServices = new CompanyServices();

export async function changeIsBlocked(req: Request, res: Response) {
  const { companyId } = req.body;

  validator.notNull([{ label: 'ID da empresa', variable: companyId }]);

  await companyServices.changeIsBlocked({
    companyId,
  });

  return res.status(200).json({
    statusCode: 200,
    message: `Status alterado com sucesso.`,
  });
}
