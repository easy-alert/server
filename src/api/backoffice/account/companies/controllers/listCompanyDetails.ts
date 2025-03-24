// TYPES
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';

// CLASS
import { CompanyServices } from '../services/companyServices';

const companyServices = new CompanyServices();
const validator = new Validator();

export async function listCompanyDetails(req: Request, res: Response) {
  const { companyId } = req.params;

  validator.check([{ label: 'ID da empresa', type: 'string', variable: companyId }]);

  const Company = await companyServices.findById({ companyId });

  return res.status(200).json(Company);
}
