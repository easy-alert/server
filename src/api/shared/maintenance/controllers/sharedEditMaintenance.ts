// CLASS
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';
import { TimeIntervalServices } from '../../timeInterval/services/timeIntervalServices';
import { SharedMaintenanceServices } from '../services/sharedMaintenanceServices';
import { IEditMaintenance } from '../services/types';

const sharedMaintenanceServices = new SharedMaintenanceServices();
const validator = new Validator();
const timeIntervalServices = new TimeIntervalServices();

export async function sharedEditMaintenance({
  ownerCompanyId,
  body: {
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
  },
}: {
  ownerCompanyId: string | null;
  body: IEditMaintenance;
}) {
  validator.check([
    { label: 'ID da manutenção', variable: maintenanceId, type: 'string' },
    { label: 'Elemento', variable: element, type: 'string' },
    { label: 'Atividade', variable: activity, type: 'string' },
    { label: 'Periodicidade', variable: frequency, type: 'number' },
    {
      label: 'ID da unidade da periodicidade',
      variable: frequencyTimeIntervalId,
      type: 'string',
    },
    { label: 'Responsável', variable: responsible, type: 'string' },

    { label: 'Fonte', variable: source, type: 'string' },
    { label: 'Prazo para execução', variable: period, type: 'number' },
    {
      label: 'ID da unidade do período',
      variable: periodTimeIntervalId,
      type: 'string',
    },
    { label: 'Delay', variable: delay, type: 'number' },
    {
      label: 'ID da unidade do delay',
      variable: delayTimeIntervalId,
      type: 'string',
    },
    {
      label: 'Observação',
      variable: observation,
      type: 'string',
      isOptional: true,
    },
  ]);

  const maintenanceCheck = await sharedMaintenanceServices.findById({
    maintenanceId,
  });

  if (maintenanceCheck?.ownerCompanyId !== ownerCompanyId) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Você não possui permissão para executar esta ação, pois essa manutenção pertence a outra empresa.`,
    });
  }

  const frequencyData = await timeIntervalServices.findById({
    timeIntervalId: frequencyTimeIntervalId,
  });
  const periodData = await timeIntervalServices.findById({
    timeIntervalId: periodTimeIntervalId,
  });
  const delayData = await timeIntervalServices.findById({
    timeIntervalId: delayTimeIntervalId,
  });

  if (period * periodData.unitTime >= frequency * frequencyData.unitTime) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'O prazo para execução não pode ser maior ou igual a periodicidade.',
    });
  }

  const maintenance = await sharedMaintenanceServices.edit({
    maintenanceId,
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

  return {
    ...maintenance,
    FrequencyTimeInterval: frequencyData,
    PeriodTimeInterval: periodData,
    DelayTimeInterval: delayData,
  };
}
