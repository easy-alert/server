import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';

interface IBody {
  maintenanceHistoryId: string;
  supplierId: string;
}

export async function unlinkSupplierToMaintenanceHistory(req: Request, res: Response) {
  const { maintenanceHistoryId, supplierId }: IBody = req.body;

  await supplierServices.unlinkWithMaintenanceHistory({ maintenanceHistoryId, supplierId });

  return res
    .status(201)
    .json({ ServerMessage: { message: 'Fornecedor desvinculado com sucesso.' } });
}
