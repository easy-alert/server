import { Request, Response } from 'express';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../../../../shared/categories/maintenace/services/sharedMaintenanceServices';
import { TimeIntervalServices } from '../../../../shared/timeInterval/services/timeIntervalServices';

const sharedMaintenanceServices = new SharedMaintenanceServices();
const validator = new Validator();
const timeIntervalServices = new TimeIntervalServices();

export async function editMaintenance(req: Request, res: Response) {
  const {
    maintenanceId,
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
    { label: 'ID da manutenção', variable: maintenanceId },
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
      label: 'ID do tempo de intervalo da período',
      variable: periodTimeIntervalId,
    },
    { label: 'delay', variable: delay },
    {
      label: 'ID do tempo de intervalo do delay',
      variable: delayTimeIntervalId,
    },
  ]);

  const maintenace = await sharedMaintenanceServices.findById({
    maintenanceId,
  });

  if (maintenace?.ownerCompanyId !== null) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Você não possui permissão para executar esta ação, pois essa manutenção pertence a outra empresa.`,
    });
  }
  await timeIntervalServices.findById({
    timeIntervalId: frequencyTimeIntervalId,
  });
  await timeIntervalServices.findById({ timeIntervalId: periodTimeIntervalId });
  await timeIntervalServices.findById({ timeIntervalId: delayTimeIntervalId });

  await sharedMaintenanceServices.edit({
    maintenanceId,
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
      message: 'Manutenção atualizada com sucesso.',
    },
  });
}
