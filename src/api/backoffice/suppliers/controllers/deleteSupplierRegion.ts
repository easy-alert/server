import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export async function deleteSupplierRegion(req: Request, res: Response) {
  const { regionId } = req.params as any as { regionId: string };

  validator.check([{ label: 'ID da região', type: 'string', variable: regionId }]);

  await supplierServices.deleteRegion(regionId);

  return res.status(200).json({ ServerMessage: { message: 'Região excluída com sucesso.' } });
}
