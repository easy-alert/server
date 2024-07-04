import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export async function findSupplierById(req: Request, res: Response) {
  const { supplierId } = req.params as any as { supplierId: string };

  validator.check([{ label: 'ID do fornecedor', type: 'string', variable: supplierId }]);

  const supplier = await supplierServices.findById(supplierId);

  return res.status(200).json({ supplier });
}
