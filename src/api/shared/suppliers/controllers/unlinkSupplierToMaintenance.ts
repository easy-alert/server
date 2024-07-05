import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';

interface IBody {
  maintenanceId: string;
  supplierId: string;
}

export async function unlinkSupplierToMaintenance(req: Request, res: Response) {
  const { maintenanceId, supplierId }: IBody = req.body;

  await supplierServices.unlinkWithMaintenance({ maintenanceId, supplierId });

  return res
    .status(200)
    .json({ ServerMessage: { message: 'Fornecedor desvinculado com sucesso.' } });
}
