// TYPES
import { Request, Response } from 'express';

// CLASS

import { Validator } from '../../../../../utils/validator/validator';
import { CompanyServices } from '../services/companyServices';

const validator = new Validator();
const companyServices = new CompanyServices();

export async function deleteCompany(req: Request, res: Response) {
  const { companyId } = req.body;

  validator.notNull([{ label: 'ID da empresa', variable: companyId }]);

  await companyServices.delete({
    companyId,
  });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Empresa excluída com sucesso.`,
    },
  });
}
