import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { checkValues } from '../../../../utils/newValidator';
import { createMaintenanceHistoryActivityCommentService } from '../../maintenanceHistoryActivities/services';

interface IBody {
  maintenanceHistoryId: string;
  supplierId: string;
}

export async function unlinkSupplierToMaintenanceHistory(req: Request, res: Response) {
  const { maintenanceHistoryId, supplierId }: IBody = req.body;
  const { syndicNanoId } = req.query as any as { syndicNanoId: string };

  checkValues([
    { label: 'ID do histórico de manutenção', type: 'string', value: maintenanceHistoryId },
    { label: 'ID do fornecedor', type: 'string', value: supplierId },
  ]);

  await supplierServices.unlinkWithMaintenanceHistory({ maintenanceHistoryId, supplierId });

  const supplier = await supplierServices.findById(supplierId);

  await createMaintenanceHistoryActivityCommentService({
    content: `O fornecedor ${supplier.name} foi removido da manutenção.`,
    userId: req.userId,
    maintenanceHistoryId,
    syndicNanoId,
  });

  return res
    .status(200)
    .json({ ServerMessage: { message: 'Fornecedor desvinculado com sucesso.' } });
}
