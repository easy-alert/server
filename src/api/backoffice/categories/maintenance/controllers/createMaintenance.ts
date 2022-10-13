import { Request, Response } from 'express';

// CLASS
import { MaintenanceServices } from '../services/maintenanceServices';
import { Validator } from '../../../../../utils/validator/validator';

const maintenanceServices = new MaintenanceServices();
const validator = new Validator();

export async function createMaintenance(req: Request, res: Response) {
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

  return res.status(200).json({
    statusCode: 201,
    message: 'Manutenção cadastrada com sucesso.',
  });
}
