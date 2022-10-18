import { Request, Response } from 'express';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../../../../shared/categories/maintenace/services/sharedMaintenanceServices';
import { TimeIntervalServices } from '../../../../shared/timeInterval/services/timeIntervalServices';

const sharedMaintenanceServices = new SharedMaintenanceServices();
const validator = new Validator();
const timeIntervalServices = new TimeIntervalServices();

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

  // #region validation
  validator.notNull([
    { label: 'ID da categoria', variable: categoryId },
    { label: 'elemento', variable: element },
    { label: 'atividade', variable: activity },
    { label: 'frequência', variable: frequency },
    {
      label: 'ID do tempo de intervalo da frequência',
      variable: frequencyTimeIntervalId,
    },
    { label: 'responsável', variable: responsible },
    { label: 'fonte', variable: source },
    { label: 'período', variable: period },
    {
      label: 'ID do tempo de intervalo do período',
      variable: periodTimeIntervalId,
    },
    { label: 'delay', variable: delay },
    {
      label: 'ID do tempo de intervalo do delay',
      variable: delayTimeIntervalId,
    },
  ]);

  const frequencyData = await timeIntervalServices.findById({
    timeIntervalId: frequencyTimeIntervalId,
  });
  const periodData = await timeIntervalServices.findById({
    timeIntervalId: periodTimeIntervalId,
  });
  const delayData = await timeIntervalServices.findById({
    timeIntervalId: delayTimeIntervalId,
  });

  // #endregion

  const maintenance = await sharedMaintenanceServices.create({
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
  });

  return res.status(200).json({
    maintenance: {
      ...maintenance,
      FrequencyTimeInterval: frequencyData,
      PeriodTimeInterval: periodData,
      DelayTimeInterval: delayData,
    },
    ServerMessage: {
      statusCode: 201,
      message: 'Manutenção cadastrada com sucesso.',
    },
  });
}
