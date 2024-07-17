import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { checkValues } from '../../../../utils/newValidator';

interface IBody {
  maintenanceHistoryId: string;
  supplierId: string;
}

export async function unlinkSupplierToMaintenanceHistory(req: Request, res: Response) {
  const { maintenanceHistoryId, supplierId }: IBody = req.body;

  checkValues([
    { label: 'ID do histórico de manutenção', type: 'string', value: maintenanceHistoryId },
    { label: 'ID do fornecedor', type: 'string', value: supplierId },
  ]);

  await supplierServices.unlinkWithMaintenanceHistory({ maintenanceHistoryId, supplierId });

  return res
    .status(200)
    .json({ ServerMessage: { message: 'Fornecedor desvinculado com sucesso.' } });
}
