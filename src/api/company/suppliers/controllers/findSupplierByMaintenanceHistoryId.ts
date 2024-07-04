import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export async function findSupplierByMaintenanceHistoryId(req: Request, res: Response) {
  const { maintenanceHistoryId } = req.params as any as { maintenanceHistoryId: string };

  validator.check([
    { label: 'ID do histórico de manutenção', type: 'string', variable: maintenanceHistoryId },
  ]);

  const supplier = await supplierServices.findByMaintenanceHistoryId(maintenanceHistoryId);

  return res.status(200).json({ supplier });
}
