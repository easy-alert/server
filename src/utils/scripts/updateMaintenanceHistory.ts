import { Request, Response } from 'express';
import { ServerMessage } from '../messages/serverMessage';
import { SharedMaintenanceServices } from '../../api/shared/maintenance/services/sharedMaintenanceServices';

const maintenanceServices = new SharedMaintenanceServices();

export async function updateMaintenanceHistory(req: Request, res: Response) {
  const { maintenanceHistoryId } = req.params;
  const { notificationDate, dueDate, resolutionDate } = req.body;

  const { token } = req.query;

  if (token !== 'Easy4L3rt!1') {
    throw new ServerMessage({
      message: 'Acesso negado.',
      statusCode: 401,
    });
  }

  const maintenancesStatus = [
    { name: 'pending', id: 'f06aec19-80c2-4a50-a227-e70ab4e75d4c' },
    { name: 'completed', id: '23e13782-f3a4-4f3d-a722-4bffcd1dbf18' },
    { name: 'overdue', id: 'bb1ccfc5-e970-404d-a5c3-ad76f8004c8d' },
    { name: 'expired', id: 'e2b084ee-7f5c-454c-993c-b8cea321838e' },
  ];

  const maintenanceHistory = await maintenanceServices.findHistoryById({ maintenanceHistoryId });

  if (!maintenanceHistory) {
    return res.status(404).json({ ServerMessage: { message: 'Manutenção não encontrada.' } });
  }

  if (!maintenanceHistory.resolutionDate && resolutionDate) {
    throw new ServerMessage({
      message: 'Você não pode resolver uma manutenção pendente.',
      statusCode: 400,
    });
  }

  let status;

  const formatedNotificationDate = notificationDate
    ? new Date(notificationDate)
    : maintenanceHistory.notificationDate;
  const formatedDueDate = dueDate ? new Date(dueDate) : maintenanceHistory.dueDate;
  const formatedResolutionDate = resolutionDate
    ? new Date(resolutionDate)
    : maintenanceHistory.resolutionDate;

  if (formatedResolutionDate) {
    if (formatedResolutionDate > new Date()) {
      status = maintenancesStatus[3].id; // Expired
    } else if (formatedResolutionDate > formatedDueDate) {
      status = maintenancesStatus[2].id; // Overdue
    } else {
      status = maintenancesStatus[1].id; // Completed
    }
  } else {
    status = maintenancesStatus[0].id; // Pending
  }

  await maintenanceServices.updateMaintenanceHistory({
    maintenanceHistoryId,
    data: {
      notificationDate: formatedNotificationDate,
      dueDate: formatedDueDate,
      resolutionDate: formatedResolutionDate,
      maintenanceStatusId: status,
    },
  });

  return res.status(200).json({ ServerMessage: { message: `Manutenção editada com sucesso.` } });
}
