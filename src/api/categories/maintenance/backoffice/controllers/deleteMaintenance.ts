/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response } from 'express';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { MaintenanceServices } from '../../services/maintenanceServices';

const validator = new Validator();
const maintenanceServices = new MaintenanceServices();

export async function deleteMaintenance(req: Request, _res: Response) {
  const { maintenanceId } = req.body;

  validator.notNull([{ label: 'ID da categoria', variable: maintenanceId }]);

  await maintenanceServices.delete({ maintenanceId });

  throw new ServerMessage({
    statusCode: 200,
    message: 'Manutenção excluída com sucesso.',
  });
}
