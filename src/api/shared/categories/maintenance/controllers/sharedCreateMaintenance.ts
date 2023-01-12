// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../services/sharedMaintenanceServices';
import { TimeIntervalServices } from '../../../timeInterval/services/timeIntervalServices';
import { ICreateMaintenanceBody } from './types';

const sharedMaintenanceServices = new SharedMaintenanceServices();
const validator = new Validator();
const timeIntervalServices = new TimeIntervalServices();

export async function sharedCreateMaintenance({
  ownerCompanyId,
  body: {
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
  },
}: {
  ownerCompanyId: string | null;
  body: ICreateMaintenanceBody;
}) {
  // #region validation

  validator.check([
    { label: 'ID da categoria', variable: categoryId, type: 'string' },
    { label: 'Elemento', variable: element, type: 'string' },
    { label: 'Atividade', variable: activity, type: 'string' },
    { label: 'Periodicidade', variable: frequency, type: 'number' },
    {
      label: 'ID do tempo de intervalo da frequência',
      variable: frequencyTimeIntervalId,
      type: 'string',
    },
    { label: 'Responsável', variable: responsible, type: 'string' },

    { label: 'Fonte', variable: source, type: 'string' },
    { label: 'Tempo para resposta', variable: period, type: 'number' },
    {
      label: 'ID do tempo de intervalo da período',
      variable: periodTimeIntervalId,
      type: 'string',
    },
    { label: 'Delay', variable: delay, type: 'number' },
    {
      label: 'ID do tempo de intervalo do delay',
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
