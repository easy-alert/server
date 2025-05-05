import { Request, Response } from 'express';

import { updateMaintenanceHistory } from '../../../../shared/maintenanceHistory/services/updateMaintenanceHistory';
import { SharedMaintenanceServices } from '../../../../shared/maintenance/services/sharedMaintenanceServices';
import { SharedMaintenanceStatusServices } from '../../../../shared/maintenanceStatus/services/sharedMaintenanceStatusServices';
import { buildingServices } from '../../../buildings/building/services/buildingServices';

import { noWeekendTimeDate } from '../../../../../utils/dateTime/noWeekendTimeDate';
import { addDays } from '../../../../../utils/dateTime';
import { changeTime } from '../../../../../utils/dateTime/changeTime';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

const sharedMaintenanceStatusServices = new SharedMaintenanceStatusServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();

export async function editMaintenanceHistory(req: Request, res: Response) {
  const { body } = req;

  if (!body) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Nenhum dado foi enviado.',
    });
  }

  if (!body.maintenanceHistoryId) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'O ID da manutenção não foi enviado.',
    });
  }

  const maintenanceStatus = await sharedMaintenanceStatusServices.findByName({
    name: body.maintenanceStatus,
  });

  const maintenanceHistory = await sharedMaintenanceServices.findHistoryById({
    maintenanceHistoryId: body.maintenanceHistoryId,
  });

  if (
    body.maintenanceStatus === 'expired' &&
    maintenanceHistory.Maintenance.MaintenanceType?.name !== 'occasional'
  ) {
    const history = await sharedMaintenanceServices.findHistoryByBuildingId({
      buildingId: maintenanceHistory.Building.id,
      maintenanceId: maintenanceHistory.Maintenance.id,
    });
    console.log("🚀 ~ editMaintenanceHistory ~ history:", history)

    if (history.length > 0 && history[0].id === maintenanceHistory.id) {
      const foundBuildingMaintenance =
        await buildingServices.findBuildingMaintenanceDaysToAnticipate({
          buildingId: maintenanceHistory.Building.id,
          maintenanceId: maintenanceHistory.Maintenance.id,
        });

      const today = changeTime({
        date: new Date(),
        time: {
          h: 0,
          m: 0,
          ms: 0,
          s: 0,
        },
      });

      const notificationDate = noWeekendTimeDate({
        date: addDays({
          date:
            // Escolhe se cria a pendente a partir da execução ou da notificação da anterior
            maintenanceHistory.Building.nextMaintenanceCreationBasis === 'executionDate'
              ? today
              : maintenanceHistory.notificationDate,
          days:
            maintenanceHistory.Maintenance.frequency *
              maintenanceHistory.Maintenance.FrequencyTimeInterval.unitTime -
            (foundBuildingMaintenance?.daysToAnticipate ?? 0),
        }),
        interval:
          maintenanceHistory.Maintenance.period *
          maintenanceHistory.Maintenance.PeriodTimeInterval.unitTime,
      });

      const dueDate = noWeekendTimeDate({
        date: addDays({
          date: notificationDate,
          days:
            maintenanceHistory.Maintenance.period *
              maintenanceHistory.Maintenance.PeriodTimeInterval.unitTime +
            (foundBuildingMaintenance?.daysToAnticipate ?? 0),
        }),
        interval:
          maintenanceHistory.Maintenance.period *
          maintenanceHistory.Maintenance.PeriodTimeInterval.unitTime,
      });

      const pendingStatus = await sharedMaintenanceStatusServices.findByName({ name: 'pending' });

      await sharedMaintenanceServices.createHistory({
        data: [
          {
            ownerCompanyId: maintenanceHistory.Company.id,
            maintenanceId: maintenanceHistory.Maintenance.id,
            buildingId: maintenanceHistory.Building.id,
            maintenanceStatusId: pendingStatus.id,
            notificationDate,
            dueDate,
            daysInAdvance: foundBuildingMaintenance?.daysToAnticipate ?? 0,
          },
        ],
      });
    }
  }

  const maintenance = await updateMaintenanceHistory({
    id: body.maintenanceHistoryId,
    dueDate: body.dueDate,
    showToResident: body.showToResident,

    MaintenancesStatus: {
      connect: {
        id: maintenanceStatus.id,
      },
    },
  });

  return res.status(200).json({
    maintenance,
    ServerMessage: {
      statusCode: 200,
      message: 'Manutenção atualizada com sucesso.',
    },
  });
}
