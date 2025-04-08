import { Request, Response } from 'express';

import { updateMaintenanceHistory } from '../../../../shared/maintenanceHistory/services/updateMaintenanceHistory';

import { ServerMessage } from '../../../../../utils/messages/serverMessage';

export async function editMaintenanceHistory(req: Request, res: Response) {
  const { body } = req;

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

  const maintenance = await updateMaintenanceHistory({
    ...req.body,
  });

  return res.status(200).json({
    maintenance,
    ServerMessage: {
      statusCode: 200,
      message: 'Manutenção atualizada com sucesso.',
    },
  });
}
