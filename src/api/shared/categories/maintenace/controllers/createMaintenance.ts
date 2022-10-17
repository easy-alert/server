import { Request, Response } from 'express';

// CLASS
import { MaintenanceServices } from '../services/maintenanceServices';
import { Validator } from '../../../../../utils/validator/validator';

const maintenanceServices = new MaintenanceServices();
const validator = new Validator();

export async function createMaintenance(req: Request, res: Response) {
  const {
    categoryId,
    ownerCompanyId,

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
    { label: 'peridiocidade', variable: frequency },
    {
      label: 'ID do tempo de intervalo da peridiocidade',
      variable: frequencyTimeIntervalId,
    },
    { label: 'responsável', variable: responsible },
    { label: 'fonte', variable: source },
    { label: 'período', variable: period },
    {
      label: 'ID do tempo de intervalo da peridiocidade',
      variable: periodTimeIntervalId,
    },
    { label: 'delay', variable: delay },
    {
      label: 'ID do tempo de intervalo do delay',
      variable: delayTimeIntervalId,
    },
  ]);

  await maintenanceServices.create({
    categoryId,
    ownerCompanyId,
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
    ServerMessage: {
      statusCode: 201,
      message: 'Manutenção cadastrada com sucesso.',
    },
  });
}
