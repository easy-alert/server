/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

// TYPES
import { NextFunction, Request, Response } from 'express';

// CLASS

import { Validator } from '../../../../utils/validator/validator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { CompanyServices } from '../services/companyServices';

const validator = new Validator();
const companyServices = new CompanyServices();

export async function deleteCompany(
  req: Request,
  _res: Response,
  _next: NextFunction,
) {
  const { companyId } = req.body;

  validator.notNull([{ label: 'ID da empresa', variable: companyId }]);

  await companyServices.delete({
    companyId,
  });

  throw new ServerMessage({
    statusCode: 200,
    message: `Empresa excluída com sucesso.`,
  });
}
