import { Request, Response } from 'express';
import { ServerMessage } from '../messages/serverMessage';
import { SharedMaintenanceServices } from '../../api/shared/maintenance/services/sharedMaintenanceServices';
import { EmailTransporterServices } from '../emailTransporter/emailTransporterServices';

const maintenanceServices = new SharedMaintenanceServices();
const emailTransporter = new EmailTransporterServices();

export async function deleteExpiredMaintenance(req: Request, res: Response) {
  const { maintenanceHistoryId } = req.params;
  const { token } = req.query;

  if (token !== 'Easy4L3rt!1') {
    throw new ServerMessage({
      message: 'Acesso negado.',
      statusCode: 401,
    });
  }

  const maintenanceHistory = await maintenanceServices.findHistoryById({ maintenanceHistoryId });

  if (maintenanceHistory.MaintenancesStatus.name === 'pending') {
    throw new ServerMessage({
      message: 'Você não pode excluir uma manutenção pendente.',
      statusCode: 400,
    });
  }

  await maintenanceServices.deleteHistory({ maintenanceHistoryId });

  await emailTransporter.sendDeleteMaintenanceScriptUsed({
    data: [maintenanceHistoryId],
    route: 'uma manutenção vencida',
    toEmail: ['tecnologia@easyalert.com.br', 'contato@easyalert.com.br'],
    buildingName: maintenanceHistory.Building.name,
  });

  return res.status(200).json({ ServerMessage: { message: `Manutenção excluída com sucesso.` } });
}
