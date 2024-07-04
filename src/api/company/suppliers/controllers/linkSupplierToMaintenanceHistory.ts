import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { SharedMaintenanceServices } from '../../../shared/maintenance/services/sharedMaintenanceServices';

interface IBody {
  maintenanceHistoryId: string;
  supplierId: string;
}

const sharedMaintenanceServices = new SharedMaintenanceServices();

export async function linkSupplierToMaintenanceHistory(req: Request, res: Response) {
  const { maintenanceHistoryId, supplierId }: IBody = req.body;

  // Vinculando fornecedor no histórico
  await supplierServices.linkWithMaintenanceHistory({ maintenanceHistoryId, supplierId });

  // Adicionando fornecedor como sugerido pra manutenção
  const { Maintenance } = await sharedMaintenanceServices.findHistoryById({ maintenanceHistoryId });

  await supplierServices.linkSuggestedSupplier({
    maintenanceId: Maintenance.id,
    supplierId,
  });

  return res.status(201).json({ ServerMessage: { message: 'Fornecedor vinculado com sucesso.' } });
}
