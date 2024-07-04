import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';

interface IBody {
  maintenanceHistoryId: string;
  supplierId: string;
}

export async function linkSupplierToMaintenanceHistory(req: Request, res: Response) {
  const { maintenanceHistoryId, supplierId }: IBody = req.body;

  // Vinculando fornecedor no histórico
  await supplierServices.linkWithMaintenanceHistory({ maintenanceHistoryId, supplierId });

  // Adicionando fornecedor como sugerido pra manutenção
  // find no mhistory pra pegar o maitenance id e criar na outta tabela

  return res.status(201).json({ ServerMessage: { message: 'Fornecedor alterado com sucesso.' } });
}
