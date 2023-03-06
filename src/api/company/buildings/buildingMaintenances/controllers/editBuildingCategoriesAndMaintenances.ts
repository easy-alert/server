// #region IMPORTS
import { Request, Response } from 'express';
import { noWeekendTimeDate } from '../../../../../utils/dateTime/noWeekendTimeDate';
import { addDays } from '../../../../../utils/functions';
import { Validator } from '../../../../../utils/validator/validator';
import { SharedCategoryServices } from '../../../../shared/categories/services/sharedCategoryServices';
import { SharedMaintenanceServices } from '../../../../shared/maintenance/services/sharedMaintenanceServices';
import { ICreateMaintenanceHistoryAndReport } from '../../../../shared/maintenance/services/types';
import { SharedMaintenanceStatusServices } from '../../../../shared/maintenanceStatus/services/sharedMaintenanceStatusServices';
import { TimeIntervalServices } from '../../../../shared/timeInterval/services/timeIntervalServices';
import { BuildingServices } from '../../building/services/buildingServices';
import { BuildingMaintenanceHistoryServices } from '../../buildingMaintenancesHistory/services/buildingMaintenanceHistoryServices';
import { BuildingCategoryAndMaintenanceServices } from '../services/buildingCategoryAndMaintenanceServices';
import { ICreateBuildingCategory } from '../services/types';
import { IDateForCreateHistory } from './types';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

// CLASS

const validator = new Validator();
const buildingCategoryAndMaintenanceServices = new BuildingCategoryAndMaintenanceServices();
const sharedCategoryServices = new SharedCategoryServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();
const buildingServices = new BuildingServices();
const timeIntervalServices = new TimeIntervalServices();
const maintenancesStatusServices = new SharedMaintenanceStatusServices();
const buildingMaintenancesHistoryServices = new BuildingMaintenanceHistoryServices();
const sharedMaintenanceStatusServices = new SharedMaintenanceStatusServices();

// #endregion

export async function editBuildingCategoriesAndMaintenances(req: Request, res: Response) {
  const { buildingId } = req.body;
  const bodyData = req.body.data;

  const today = new Date(new Date().toISOString().split('T')[0]);

  // #region VALIDATIONS

  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  const Building = await buildingServices.findById({ buildingId });

  for (let i = 0; i < bodyData.length; i++) {
    validator.check([
      {
        label: 'ID da categoria',
        type: 'string',
        variable: bodyData[i].categoryId,
      },
    ]);

    await sharedCategoryServices.findById({ categoryId: bodyData[i].categoryId });

    for (let j = 0; j < bodyData[i].Maintenances.length; j++) {
      validator.check([
        {
          label: 'ID da manutenção',
          type: 'string',
          variable: bodyData[i].Maintenances[j].id,
        },
      ]);

      if (
        bodyData[i].Maintenances[j].resolutionDate &&
        new Date(bodyData[i].Maintenances[j].resolutionDate) > today
      ) {
        throw new ServerMessage({
          statusCode: 400,
          message: 'A data da última conclusão deve ser menor ou igual a hoje',
        });
      }

      if (
        bodyData[i].Maintenances[j].notificationDate &&
        new Date(bodyData[i].Maintenances[j].notificationDate) < today
      ) {
        throw new ServerMessage({
          statusCode: 400,
          message: 'A data da primeira notificação deve ser maior que hoje',
        });
      }

      await sharedMaintenanceServices.findById({ maintenanceId: bodyData[i].Maintenances[j].id });
    }
  }

  // #endregion

  // #region DELETING OLD DATA
  const existsMaintenances = await buildingCategoryAndMaintenanceServices.findByBuildingId({
    buildingId,
  });

  if (existsMaintenances !== null) {
    await buildingCategoryAndMaintenanceServices.deleteCategoriesAndMaintenances({ buildingId });
  }

  // #endregion

  // #region CREATING NEW DATA

  let data: ICreateBuildingCategory;

  const DataForCreateHistory: IDateForCreateHistory[] = [];
  const maintenances = [];
  const maintenancesForHistory = [];

  for (let i = 0; i < bodyData.length; i++) {
    for (let j = 0; j < bodyData[i].Maintenances.length; j++) {
      maintenances.push({ maintenanceId: bodyData[i].Maintenances[j].id });

      maintenancesForHistory.push({
        maintenanceId: bodyData[i].Maintenances[j].id,
        resolutionDate: bodyData[i].Maintenances[j].resolutionDate
          ? new Date(bodyData[i].Maintenances[j].resolutionDate)
          : null,
        notificationDate: bodyData[i].Maintenances[j].notificationDate
          ? new Date(bodyData[i].Maintenances[j].notificationDate)
          : null,
      });
    }

    data = {
      buildingId,
      categoryId: bodyData[i].categoryId,
      Maintenances: {
        createMany: {
          data: maintenances,
        },
      },
    };

    await buildingCategoryAndMaintenanceServices.createCategoriesAndMaintenances(data);
  }

  // #endregion

  // #region CREATING MAINTENANCES HISTORY

  await buildingMaintenancesHistoryServices.deletePendingMaintenancesHistory({ buildingId });

  const buildingDeliveryDate = Building!.deliveryDate;
  const maintenanceStatus = await maintenancesStatusServices.findByName({ name: 'pending' });

  for (let i = 0; i < maintenancesForHistory.length; i++) {
    // getting maintenances data
    const maintenance: any = await sharedMaintenanceServices.findById({
      maintenanceId: maintenancesForHistory[i].maintenanceId,
    });

    maintenances[i] = {
      ...maintenance,
      notificationDate: maintenancesForHistory[i].notificationDate,
      resolutionDate: maintenancesForHistory[i].resolutionDate,
    };
  }

  const completedStatus = await sharedMaintenanceStatusServices.findByName({ name: 'completed' });

  let notificationDate = null;

  for (let i = 0; i < maintenances.length; i++) {
    const timeIntervalDelay = await timeIntervalServices.findById({
      timeIntervalId: maintenances[i].delayTimeIntervalId,
    });
    const timeIntervalPeriod = await timeIntervalServices.findById({
      timeIntervalId: maintenances[i].periodTimeIntervalId,
    });
    const timeIntervalFrequency = await timeIntervalServices.findById({
      timeIntervalId: maintenances[i].frequencyTimeIntervalId,
    });

    if (maintenances[i].resolutionDate === null) {
      notificationDate = noWeekendTimeDate({
        date: addDays({
          date: buildingDeliveryDate,
          days:
            maintenances[i].frequency * timeIntervalFrequency.unitTime +
            maintenances[i].delay * timeIntervalDelay.unitTime,
        }),
        interval: maintenances[i].delay * timeIntervalDelay.unitTime,
      });

      if (buildingDeliveryDate < today) {
        notificationDate = noWeekendTimeDate({
          date: addDays({
            date: today,
            days:
              maintenances[i].frequency * timeIntervalFrequency.unitTime +
              maintenances[i].delay * timeIntervalDelay.unitTime,
          }),
          interval: maintenances[i].delay * timeIntervalDelay.unitTime,
        });
      }

      if (maintenances[i].notificationDate !== null) {
        notificationDate = maintenances[i].notificationDate;
      }
    } else {
      // #region Create History for maintenanceHistory
      const dataForCreateHistoryAndReport: ICreateMaintenanceHistoryAndReport = {
        buildingId,
        maintenanceId: maintenances[i].id,
        ownerCompanyId: req.Company.id,
        maintenanceStatusId: completedStatus.id,
        notificationDate: maintenances[i].resolutionDate,
        resolutionDate: maintenances[i].resolutionDate,
        dueDate: maintenances[i].resolutionDate,
        MaintenanceReport: {
          create: {
            cost: 0,
            observation: '',
            responsibleSyndicId: null,
          },
        },
      };
      await sharedMaintenanceServices.createHistoryAndReport({
        data: dataForCreateHistoryAndReport,
      });

      // #endregion

      const resolutionDate = noWeekendTimeDate({
        date: addDays({
          date: maintenances[i].resolutionDate,
          days:
            maintenances[i].frequency * timeIntervalFrequency.unitTime +
            maintenances[i].delay * timeIntervalDelay.unitTime,
        }),
        interval: maintenances[i].delay * timeIntervalDelay.unitTime,
      });

      notificationDate = noWeekendTimeDate({
        date: addDays({
          date: resolutionDate,
          days:
            maintenances[i].frequency * timeIntervalFrequency.unitTime +
            maintenances[i].delay * timeIntervalDelay.unitTime,
        }),
        interval: maintenances[i].delay * timeIntervalDelay.unitTime,
      });

      if (resolutionDate < today) {
        notificationDate = noWeekendTimeDate({
          date: addDays({
            date: today,
            days:
              maintenances[i].frequency * timeIntervalFrequency.unitTime +
              maintenances[i].delay * timeIntervalDelay.unitTime,
          }),
          interval: maintenances[i].delay * timeIntervalDelay.unitTime,
        });
      }

      if (maintenances[i].notificationDate !== null) {
        notificationDate = maintenances[i].notificationDate;
      }
    }

    const dueDate = noWeekendTimeDate({
      date: addDays({
        date: notificationDate,
        days: maintenances[i].period * timeIntervalPeriod.unitTime,
      }),
      interval: maintenances[i].period * timeIntervalFrequency.unitTime,
    });

    DataForCreateHistory.push({
      buildingId,
      maintenanceId: maintenances[i].id,
      ownerCompanyId: req.Company.id,
      maintenanceStatusId: maintenanceStatus.id,
      notificationDate,
      dueDate,
    });
  }

  await sharedMaintenanceServices.createHistory({
    data: DataForCreateHistory,
  });

  // #endregion

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Manutenções editadas com sucesso.`,
    },
  });
}
