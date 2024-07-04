import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export async function findLinkedSuppliersByMaintenanceHistoryId(req: Request, res: Response) {
  const { maintenanceHistoryId } = req.params as any as { maintenanceHistoryId: string };

  validator.check([
    { label: 'ID do histórico de manutenção', type: 'string', variable: maintenanceHistoryId },
  ]);

  const suppliers = await supplierServices.findManyByMaintenanceHistoryId(maintenanceHistoryId);

  return res.status(200).json({ suppliers });
}
