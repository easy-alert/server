import { Request, Response } from 'express';

import { updateMaintenanceHistory } from '../../../../shared/maintenanceHistory/services/updateMaintenanceHistory';
import { SharedMaintenanceStatusServices } from '../../../../shared/maintenanceStatus/services/sharedMaintenanceStatusServices';

import { ServerMessage } from '../../../../../utils/messages/serverMessage';

const sharedMaintenanceStatusServices = new SharedMaintenanceStatusServices();

export async function editMaintenanceHistory(req: Request, res: Response) {
  const { body } = req;
  console.log('🚀 ~ editMaintenanceHistory ~ body:', body);

  if (!body) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Nenhum dado foi enviado.',
    });
  }

  if (!body.id) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'O ID da manutenção não foi enviado.',
    });
  }

  const maintenanceStatus = await sharedMaintenanceStatusServices.findByName({
    name: body.maintenanceStatus,
  });

  const maintenance = await updateMaintenanceHistory({
    id: body.id,
    dueDate: body.dueDate,
    showToResident: body.showToResident,

    MaintenancesStatus: {
      connect: {
        id: maintenanceStatus.id,
      },
    },
  });

  return res.status(200).json({
    maintenance,
    ServerMessage: {
      statusCode: 200,
      message: 'Manutenção atualizada com sucesso.',
    },
  });
}
