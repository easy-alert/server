import { addDays } from '../../../../utils/dateTime';
import { changeTime } from '../../../../utils/dateTime/changeTime';
import { noWeekendTimeDate } from '../../../../utils/dateTime/noWeekendTimeDate';

interface MaintenancesStatus {
  name: string;
  singularLabel: string;
}

interface MaintenancesHistory {
  wasNotified: boolean;
  notificationDate: Date;
  resolutionDate: Date | null;
  MaintenancesStatus: MaintenancesStatus;
}

interface FrequencyTimeInterval {
  id: string;
  name: string;
  pluralLabel: string;
  singularLabel: string;
  unitTime: number;
}

interface Maintenance {
  Maintenance: {
    MaintenancesHistory: MaintenancesHistory[];
    id: string;
    element: string;
    activity: string;
    frequency: number;
    delay: number;
    period: number;
    responsible: string;
    source: string;
    observation: string | null;
    ownerCompanyId: string | null;
    FrequencyTimeInterval: FrequencyTimeInterval;
    DelayTimeInterval: FrequencyTimeInterval;
    PeriodTimeInterval: FrequencyTimeInterval;
  };
}

export function handleMaintenanceRecentDates(maintenance: Maintenance) {
  const today = changeTime({
    date: new Date(),
    time: {
      h: 0,
      m: 0,
      ms: 0,
      s: 0,
    },
  });

  const frequencyDays =
    maintenance.Maintenance.frequency * maintenance.Maintenance.FrequencyTimeInterval.unitTime;

  const nextNotificationDate = maintenance.Maintenance.MaintenancesHistory.find(
    (e) => e.MaintenancesStatus.name === 'pending',
  )?.notificationDate;

  let futureNotificationDate = null;
  let showFutureNotificationDate = false;

  // se existir a pendente já calcula a a previsao da proxima notificaçao, garantindo que nao caia no find, e já decide se hoje é maior que a notificação real, para mostrar a real ou a previsao
  if (nextNotificationDate) {
    showFutureNotificationDate = today >= nextNotificationDate;

    futureNotificationDate = noWeekendTimeDate({
      date: addDays({ date: nextNotificationDate, days: frequencyDays }),
      interval:
        maintenance.Maintenance.frequency * maintenance.Maintenance.FrequencyTimeInterval.unitTime,
    });
  }

  //  confiando no find do js que vai buscar sempre baseado na ordem, pois estou trazendo do banco ordenado por createdAt
  const lastResolution = maintenance.Maintenance.MaintenancesHistory.find(
    (e) => e.MaintenancesStatus.name === 'completed' || e.MaintenancesStatus.name === 'overdue',
  );

  let wasAnticipated = false;

  if (lastResolution?.resolutionDate) {
    wasAnticipated = lastResolution.resolutionDate < lastResolution.notificationDate;
  }

  const lastNotification = maintenance.Maintenance.MaintenancesHistory.find(
    (e) => e.wasNotified === true,
  );

  let lastNotificationDate = null;

  const dateToString = (date: Date) => date.toLocaleDateString('pt-BR');

  if (wasAnticipated) {
    lastNotificationDate = 'Realizada antes da notificação';
  } else if (lastNotification?.notificationDate) {
    lastNotificationDate = dateToString(lastNotification.notificationDate);
  }

  const dates = {
    nextNotificationDate: showFutureNotificationDate
      ? futureNotificationDate && dateToString(futureNotificationDate)
      : nextNotificationDate && dateToString(nextNotificationDate),

    // convertido ali em cima
    lastNotificationDate: lastNotificationDate || null,

    lastNotificationStatus: wasAnticipated
      ? lastResolution?.MaintenancesStatus.singularLabel
      : lastNotification?.MaintenancesStatus.singularLabel,

    lastResolutionDate: lastResolution?.resolutionDate
      ? dateToString(lastResolution?.resolutionDate)
      : null,
  };

  return dates;
}
