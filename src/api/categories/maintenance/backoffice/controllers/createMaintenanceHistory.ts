/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response } from 'express';

// CLASS
import { MaintenanceServices } from '../../services/maintenanceServices';
import { Validator } from '../../../../../utils/validator/validator';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

const maintenanceServices = new MaintenanceServices();
const validator = new Validator();

export async function createMaintenanceHistory(req: Request, _res: Response) {
  const {
    maintenanceId,
    element,
    activity,
    frequency,
    responsible,
    source,
    period,
    delay,
    observation,
  } = req.body;

  validator.notNull([
    { label: 'ID da manutenção', variable: maintenanceId },
    { label: 'elemento', variable: element },
    { label: 'atividade', variable: activity },
    { label: 'peridiocidade', variable: frequency },
    { label: 'responsável', variable: responsible },
    { label: 'fonte', variable: source },
    { label: 'período', variable: period },
    { label: 'delay', variable: delay },
  ]);

  await maintenanceServices.createMaintenanceHistory({
    maintenanceId,
    element,
    activity,
    frequency,
    responsible,
    source,
    period,
    delay,
    observation,
  });

  throw new ServerMessage({
    statusCode: 201,
    message: 'Manutenção editada com sucesso.',
  });
}
