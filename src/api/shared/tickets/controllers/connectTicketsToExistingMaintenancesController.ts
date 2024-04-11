import { Response, Request } from 'express';
import { checkValues } from '../../../../utils/newValidator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { ticketServices } from '../services/ticketServices';
import { SharedMaintenanceServices } from '../../maintenance/services/sharedMaintenanceServices';

interface IBody {
  ticketIds: string[];
  maintenanceHistoryId: string;
}

const sharedMaintenanceServices = new SharedMaintenanceServices();

export async function connectTicketsToExistingMaintenancesController(req: Request, res: Response) {
  const { maintenanceHistoryId, ticketIds }: IBody = req.body;

  checkValues([
    { label: 'IDs dos chamados', type: 'array', value: ticketIds },
    { label: 'ID da manutenção', type: 'string', value: maintenanceHistoryId },
  ]);

  const maintenanceHistory = await sharedMaintenanceServices.findHistoryById({
    maintenanceHistoryId,
  });

  const openTicketsCount = await ticketServices.countOpenTickets({
    buildingId: maintenanceHistory.Building.id,
    ticketIds,
  });

  if (openTicketsCount !== ticketIds.length) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Algum chamado selecionado já foi respondido.`,
    });
  }

  if (maintenanceHistory.MaintenancesStatus.name === 'pending') {
    await ticketServices.updateMany({
      data: {
        maintenanceHistoryId,
        statusName: 'awaitingToFinish',
      },
      where: {
        id: { in: ticketIds },
      },
    });
  }

  if (maintenanceHistory.MaintenancesStatus.name === 'completed') {
    await ticketServices.updateMany({
      data: {
        maintenanceHistoryId,
        statusName: 'finished',
      },
      where: {
        id: { in: ticketIds },
      },
    });

    await ticketServices.sendFinishedTicketEmails({ ticketIds });
  }

  return res.status(200).json({ ServerMessage: { message: 'Chamados respondidos com sucesso.' } });
}
