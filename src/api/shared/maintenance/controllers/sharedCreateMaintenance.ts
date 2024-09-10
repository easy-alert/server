// CLASS
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';
import { sharedCategoryAndMaintenanceServices } from '../../categoryAndMaintenanceTypes/services/sharedCategoryAndMaintenanceServices,';
import { TimeIntervalServices } from '../../timeInterval/services/timeIntervalServices';
import { SharedMaintenanceServices } from '../services/sharedMaintenanceServices';
import { ICreateMaintenanceBody } from './types';

const sharedMaintenanceServices = new SharedMaintenanceServices();
const validator = new Validator();
const timeIntervalServices = new TimeIntervalServices();

export async function sharedCreateMaintenance({
  ownerCompanyId,
  maintenanceTypeName,
  verifyPeriod = false,
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
    instructions,
  },
}: {
  ownerCompanyId: string | null;
  maintenanceTypeName: string;
  verifyPeriod?: boolean;
  body: ICreateMaintenanceBody;
}) {
  // #region validation

  validator.check([
    { label: 'ID da categoria', variable: categoryId, type: 'string' },
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

  const frequencyData = await timeIntervalServices.findById({
    timeIntervalId: frequencyTimeIntervalId,
  });
  const periodData = await timeIntervalServices.findById({
    timeIntervalId: periodTimeIntervalId,
  });
  const delayData = await timeIntervalServices.findById({
    timeIntervalId: delayTimeIntervalId,
  });

  if (verifyPeriod && period * periodData.unitTime >= frequency * frequencyData.unitTime) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'O prazo para execução não pode ser maior ou igual a periodicidade.',
    });
  }

  const maintenanceType = await sharedCategoryAndMaintenanceServices.findByName({
    name: maintenanceTypeName,
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
    maintenanceTypeId: maintenanceType.id,
    instructions,
  });

  return {
    ...maintenance,
    FrequencyTimeInterval: frequencyData,
    PeriodTimeInterval: periodData,
    DelayTimeInterval: delayData,
    instructions,
  };
}
