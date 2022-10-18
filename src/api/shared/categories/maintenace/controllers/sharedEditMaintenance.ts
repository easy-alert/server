import { ServerMessage } from '../../../../../utils/messages/serverMessage';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../services/sharedMaintenanceServices';
import { TimeIntervalServices } from '../../../timeInterval/services/timeIntervalServices';
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

  if (maintenace?.ownerCompanyId !== ownerCompanyId) {
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
