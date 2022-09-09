/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';

// CLASS
import { MaintenanceServices } from '../../services/maintenanceServices';
import { Validator } from '../../../../../utils/validator/validator';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

const maintenanceServices = new MaintenanceServices();
const validator = new Validator();

export async function createMaintenance(
  req: Request,
  _res: Response,
  _next: NextFunction,
) {
  const {
    categoryId,
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
    { label: 'ID da categoria', variable: categoryId },
    { label: 'elemento', variable: element },
    { label: 'atividade', variable: activity },
    { label: 'peridiocidade', variable: frequency },
    { label: 'responsável', variable: responsible },
    { label: 'fonte', variable: source },
    { label: 'período', variable: period },
    { label: 'delay', variable: delay },
  ]);

  const maintenance = await maintenanceServices.create({ categoryId });

  await maintenanceServices.createMaintenanceHistory({
    maintenanceId: maintenance.id,
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
    message: 'Manutenção cadastrada com sucesso.',
  });
}
