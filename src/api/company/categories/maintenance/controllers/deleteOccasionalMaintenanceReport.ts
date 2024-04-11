// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../../../../shared/maintenance/services/sharedMaintenanceServices';
import { SharedCategoryServices } from '../../../../shared/categories/services/sharedCategoryServices';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { ticketServices } from '../../../../shared/tickets/services/ticketServices';

const validator = new Validator();
const sharedMaintenanceServices = new SharedMaintenanceServices();
const sharedCategoryServices = new SharedCategoryServices();

// #endregion

export async function deleteOccasionalMaintenanceHistory(req: Request, res: Response) {
  const { maintenanceHistoryId } = req.params;

  validator.check([
    { label: 'ID do histórico de manutenção', type: 'string', variable: maintenanceHistoryId },
  ]);

  const maintenanceHistory = await sharedMaintenanceServices.findHistoryById({
    maintenanceHistoryId,
  });

  if (maintenanceHistory.Maintenance.MaintenanceType?.name !== 'occasional')
    throw new ServerMessage({
      statusCode: 400,
      message: 'Você não pode excluir um histórico de manutenção que não seja avulsa.',
    });

  const categoryHistory = await sharedMaintenanceServices.findHistoryByCategoryId({
    categoryId: maintenanceHistory.Maintenance.Category.id,
  });

  await ticketServices.updateMany({
    data: { statusName: 'open' },
    where: { maintenanceHistoryId: maintenanceHistory.id },
  });

  if (categoryHistory.length < 1) {
    await sharedCategoryServices.delete({ categoryId: maintenanceHistory.Maintenance.Category.id });
  } else {
    await sharedMaintenanceServices.deleteHistory({ maintenanceHistoryId });
  }

  return res.status(200).json({
    ServerMessage: {
      message: 'Histórico de manutenção excluído com sucesso.',
    },
  });
}
