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
  res: Response,
  _next: NextFunction,
) {
  const {
    categoryId,
    element,
    activity,
    frequency,
    frequencyTimeIntervalId,
    responsible,
    source,
    period,
    periodTimeIntervalId,
    delay,
    delayTimeIntervalId,
    observation,
  } = req.body;

  validator.notNull([
    { label: 'ID da categoria', variable: categoryId },
    { label: 'elemento', variable: element },
    { label: 'atividade', variable: activity },
    { label: 'frequencia', variable: frequency },
    { label: 'tempo de intervalo inválido', variable: frequencyTimeIntervalId },
    { label: 'responsável', variable: responsible },
    { label: 'fonte', variable: source },
    { label: 'período', variable: period },
    { label: 'tempo de intervalo inválido', variable: periodTimeIntervalId },
    { label: 'delay', variable: delay },
    { label: 'tempo de intervalo inválido', variable: delayTimeIntervalId },
  ]);

  const maintenance = await maintenanceServices.create({ categoryId, element });

  const MaintenanceHistory = await maintenanceServices.createMaintenanceHistory(
    {
      maintenanceId: maintenance.id,
      element,
      activity,
      frequency,
      frequencyTimeIntervalId,
      responsible,
      source,
      period,
      periodTimeIntervalId,
      delay,
      delayTimeIntervalId,
      observation,
    },
  );

  return res.status(200).json({
    maintenance: {
      id: maintenance.id,
      element: maintenance.element,
      MaintenanceHistory,
    },

    ServerMessage: {
      statusCode: 201,
      message: 'Manutenção cadastrada com sucesso.',
    },
  });
}
