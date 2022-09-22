/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response } from 'express';

// CLASS
import { MaintenanceServices } from '../../services/maintenanceServices';
import { TimeIntervalServices } from '../../../../timeInterval/services/timeIntervalServices';
import { Validator } from '../../../../../utils/validator/validator';

const maintenanceServices = new MaintenanceServices();
const timeIntervalServices = new TimeIntervalServices();
const validator = new Validator();

export async function createMaintenance(req: Request, res: Response) {
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

  const newMaintenance = await maintenanceServices.create({
    categoryId,
    element,
  });

  const maintenanceHistory = await maintenanceServices.createMaintenanceHistory(
    {
      maintenanceId: newMaintenance.id,
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

  const maintenance = {
    id: newMaintenance.id,
    element: newMaintenance.element,
    MaintenancesHistory: [
      {
        id: maintenanceHistory.id,
        activity: maintenanceHistory.activity,
        frequency: maintenanceHistory.frequency,
        FrequencyTimeInterval: await timeIntervalServices.findById({
          timeIntervalId: frequencyTimeIntervalId,
        }),
        responsible: maintenanceHistory.responsible,
        source: maintenanceHistory.source,
        period: maintenanceHistory.period,
        PeriodTimeInterval: await timeIntervalServices.findById({
          timeIntervalId: periodTimeIntervalId,
        }),
        delay: maintenanceHistory.delay,
        DelayTimeInterval: await timeIntervalServices.findById({
          timeIntervalId: delayTimeIntervalId,
        }),
        observation: maintenanceHistory.observation,
      },
    ],
  };

  return res.status(200).json({
    maintenance,
    ServerMessage: {
      statusCode: 201,
      message: 'Manutenção cadastrada com sucesso.',
    },
  });
}
