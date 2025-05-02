import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { SharedMaintenanceServices } from '../../maintenance/services/sharedMaintenanceServices';
import { checkValues } from '../../../../utils/newValidator';
import { createMaintenanceHistoryActivityCommentService } from '../../maintenanceHistoryActivities/services';

interface IBody {
  maintenanceHistoryId: string;
  supplierId: string;
}

const sharedMaintenanceServices = new SharedMaintenanceServices();

export async function linkSupplierToMaintenanceHistory(req: Request, res: Response) {
  const { maintenanceHistoryId, supplierId }: IBody = req.body;
  const { syndicNanoId } = req.query as any as { syndicNanoId: string };

  checkValues([
    { label: 'ID do histórico de manutenção', type: 'string', value: maintenanceHistoryId },
    { label: 'ID do fornecedor', type: 'string', value: supplierId },
  ]);

  // Vinculando fornecedor no histórico
  await supplierServices.linkWithMaintenanceHistory({ maintenanceHistoryId, supplierId });

  // Adicionando fornecedor como sugerido pra manutenção
  const { Maintenance } = await sharedMaintenanceServices.findHistoryById({ maintenanceHistoryId });

  const { supplier } = await supplierServices.linkSuggestedSupplier({
    maintenanceId: Maintenance.id,
    supplierId,
  });

  await createMaintenanceHistoryActivityCommentService({
    content: `O fornecedor ${supplier.name} foi adicionado a manutenção.`,
    userId: req.userId,
    maintenanceHistoryId,
    syndicNanoId,
  });

  return res.status(201).json({ ServerMessage: { message: 'Fornecedor vinculado com sucesso.' } });
}
