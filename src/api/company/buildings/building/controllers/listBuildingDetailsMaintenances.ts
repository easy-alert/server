// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';

// CLASS
import { BuildingServices } from '../services/buildingServices';
import { changeTime } from '../../../../../utils/dateTime/changeTime';
import { addDays, dateFormatter } from '../../../../../utils/dateTime';
import { noWeekendTimeDate } from '../../../../../utils/dateTime/noWeekendTimeDate';

const buildingServices = new BuildingServices();
const validator = new Validator();
// #endregion

export async function listBuildingDetailsMaintenances(req: Request, res: Response) {
  const { buildingId } = req.params;

  // #region VALIDATION

  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  const building = await buildingServices.findById({ buildingId });

  // #endregion

  const today = changeTime({
    date: new Date(),
    time: {
      h: 0,
      m: 0,
      ms: 0,
      s: 0,
    },
  });

  const BuildingMaintenances = await buildingServices.listMaintenances({
    buildingId,
  });

  const BuildingMaintenancesFormatted = BuildingMaintenances.map((category) => ({
    ...category,
    Maintenances: category.Maintenances.map((maintenance) => {
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
            maintenance.Maintenance.frequency *
            maintenance.Maintenance.FrequencyTimeInterval.unitTime,
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
      // componentizar e arrumar essa naba toda
      // botei o dateFormatter só no que pode mudar pra string, o resto tá no front
      return {
        ...maintenance,
        Maintenance: {
          ...maintenance.Maintenance,

          nextNotificationDate: showFutureNotificationDate
            ? futureNotificationDate
            : nextNotificationDate,

          // eslint-disable-next-line no-nested-ternary
          lastNotificationDate: wasAnticipated
            ? 'Realizada antes da notificação'
            : lastNotification?.notificationDate
            ? dateFormatter(lastNotification?.notificationDate)
            : null,

          lastNotificationStatus: wasAnticipated
            ? lastResolution?.MaintenancesStatus.singularLabel
            : lastNotification?.MaintenancesStatus.singularLabel,

          lastResolutionDate: lastResolution?.resolutionDate,
        },
      };
    }),
  }));

  return res
    .status(200)
    .json({ buildingName: building?.name, BuildingMaintenances: BuildingMaintenancesFormatted });
}
