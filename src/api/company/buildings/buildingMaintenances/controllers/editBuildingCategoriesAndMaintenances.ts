// #region IMPORTS
import { Request, Response } from 'express';
import { noWeekendTimeDate } from '../../../../../utils/dateTime/noWeekendTimeDate';

import { Validator } from '../../../../../utils/validator/validator';
import { SharedCategoryServices } from '../../../../shared/categories/services/sharedCategoryServices';
import { SharedMaintenanceServices } from '../../../../shared/maintenance/services/sharedMaintenanceServices';
import { ICreateMaintenanceHistoryAndReport } from '../../../../shared/maintenance/services/types';
import { SharedMaintenanceStatusServices } from '../../../../shared/maintenanceStatus/services/sharedMaintenanceStatusServices';
import { TimeIntervalServices } from '../../../../shared/timeInterval/services/timeIntervalServices';
import { BuildingServices } from '../../building/services/buildingServices';
import { BuildingMaintenanceHistoryServices } from '../../buildingMaintenancesHistory/services/buildingMaintenanceHistoryServices';
import { BuildingCategoryAndMaintenanceServices } from '../services/buildingCategoryAndMaintenanceServices';
import { IDateForCreateHistory, IMaintenancesForHistorySelected } from './types';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { addDays } from '../../../../../utils/dateTime';
import { changeTime } from '../../../../../utils/dateTime/changeTime';
import { SharedMaintenanceReportsServices } from '../../../../shared/maintenancesReports/services/SharedMaintenanceReportsServices';

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
const sharedMaintenanceReportsServices = new SharedMaintenanceReportsServices();

// #endregion

export async function editBuildingCategoriesAndMaintenances(req: Request, res: Response) {
  const { buildingId, origin } = req.body;
  const bodyData = req.body.data;

  const today = changeTime({
    date: new Date(),
    time: {
      h: 0,
      m: 0,
      ms: 0,
      s: 0,
    },
  });

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

  // let data: ICreateBuildingCategory;

  const DataForCreateHistory: IDateForCreateHistory[] = [];

  const maintenancesForHistorySelected: IMaintenancesForHistorySelected[] = [];
  const maintenancesForHistorySelectedIds = [];

  const maintenancesForHistoryNotSelectedIds = [];

  for (let i = 0; i < bodyData.length; i++) {
    const maintenancesForCreate = [];

    for (let j = 0; j < bodyData[i].Maintenances.length; j++) {
      if (bodyData[i].Maintenances[j].isSelected) {
        maintenancesForCreate.push({ maintenanceId: bodyData[i].Maintenances[j].id });
        maintenancesForHistorySelected.push({
          maintenanceId: bodyData[i].Maintenances[j].id,
          resolutionDate: bodyData[i].Maintenances[j].resolutionDate
            ? changeTime({
                date: new Date(bodyData[i].Maintenances[j].resolutionDate),
                time: { h: 0, m: 0, ms: 0, s: 0 },
              })
            : null,
          notificationDate: bodyData[i].Maintenances[j].notificationDate
            ? changeTime({
                date: new Date(bodyData[i].Maintenances[j].notificationDate),
                time: { h: 0, m: 0, ms: 0, s: 0 },
              })
            : null,
        });

        maintenancesForHistorySelectedIds.push(bodyData[i].Maintenances[j].id);
      } else {
        maintenancesForHistoryNotSelectedIds.push(bodyData[i].Maintenances[j].id);
      }
    }

    if (maintenancesForCreate.length === 0) continue;

    const data = {
      buildingId,
      categoryId: bodyData[i].categoryId,
      Maintenances: {
        createMany: {
          data: maintenancesForCreate,
        },
      },
    };

    await buildingCategoryAndMaintenanceServices.createCategoriesAndMaintenances(data);
  }

  // #endregion

  // #region CREATING MAINTENANCES HISTORY

  await buildingMaintenancesHistoryServices.deletePendingMaintenancesHistory({
    maintenancesIds: maintenancesForHistoryNotSelectedIds,
    buildingId,
  });

  const buildingDeliveryDate = Building!.deliveryDate;
  const maintenanceStatus = await maintenancesStatusServices.findByName({ name: 'pending' });

  const maintenanceHistory = await sharedMaintenanceServices.findManyHistory({ buildingId });

  const maintenancesForCreateHistory = [];

  for (let i = 0; i < maintenancesForHistorySelected.length; i++) {
    const maintenanceInHistory = maintenanceHistory.some(
      (maintenance) =>
        maintenance.maintenanceId === maintenancesForHistorySelected[i].maintenanceId,
    );

    if (!maintenanceInHistory) {
      maintenancesForCreateHistory.push(maintenancesForHistorySelected[i]);
    }
  }

  const updatedsMaintenances: any[] = [];

  for (let i = 0; i < maintenancesForCreateHistory.length; i++) {
    // getting maintenances data

    const maintenance: any = await sharedMaintenanceServices.findById({
      maintenanceId: maintenancesForCreateHistory[i].maintenanceId,
    });

    updatedsMaintenances[i] = {
      ...maintenance,
      notificationDate: maintenancesForCreateHistory[i].notificationDate,
      resolutionDate: maintenancesForCreateHistory[i].resolutionDate,
    };
  }

  const completedStatus = await sharedMaintenanceStatusServices.findByName({ name: 'completed' });

  let notificationDate = null;
  for (let i = 0; i < updatedsMaintenances.length; i++) {
    const timeIntervalDelay = await timeIntervalServices.findById({
      timeIntervalId: updatedsMaintenances[i].delayTimeIntervalId,
    });
    const timeIntervalPeriod = await timeIntervalServices.findById({
      timeIntervalId: updatedsMaintenances[i].periodTimeIntervalId,
    });
    const timeIntervalFrequency = await timeIntervalServices.findById({
      timeIntervalId: updatedsMaintenances[i].frequencyTimeIntervalId,
    });

    // #region  NOTIFICATION DATE FOR OLDBUILDING DELIVERIES

    let notificationDateForOldBuildingDeliveries = addDays({
      date: buildingDeliveryDate,
      days: updatedsMaintenances[i].delay * timeIntervalDelay.unitTime,
    });

    while (notificationDateForOldBuildingDeliveries < today) {
      notificationDateForOldBuildingDeliveries = addDays({
        date: notificationDateForOldBuildingDeliveries,
        days: updatedsMaintenances[i].frequency * timeIntervalFrequency.unitTime,
      });
    }

    notificationDateForOldBuildingDeliveries = changeTime({
      date: noWeekendTimeDate({
        date: notificationDateForOldBuildingDeliveries,
        interval: updatedsMaintenances[i].frequency * timeIntervalFrequency.unitTime,
      }),
      time: {
        h: 0,
        m: 0,
        ms: 0,
        s: 0,
      },
    });

    // #endregion

    if (updatedsMaintenances[i].resolutionDate === null) {
      notificationDate = noWeekendTimeDate({
        date: addDays({
          date: buildingDeliveryDate,
          days:
            updatedsMaintenances[i].frequency * timeIntervalFrequency.unitTime +
            updatedsMaintenances[i].delay * timeIntervalDelay.unitTime,
        }),
        interval: updatedsMaintenances[i].frequency * timeIntervalFrequency.unitTime,
      });

      if (buildingDeliveryDate < today) {
        notificationDate = noWeekendTimeDate({
          date: notificationDateForOldBuildingDeliveries,
          interval: updatedsMaintenances[i].frequency * timeIntervalFrequency.unitTime,
        });
      }

      if (updatedsMaintenances[i].notificationDate !== null) {
        notificationDate = updatedsMaintenances[i].notificationDate;
      }
    } else {
      // #region Create History for maintenanceHistory

      const categoryToUpdate = bodyData.find(
        (data: any) => data.categoryId === updatedsMaintenances[i].categoryId,
      );

      const maintenanceToUpdate = categoryToUpdate.Maintenances.find(
        (maintenance: any) => maintenance.id === updatedsMaintenances[i].id,
      );

      // faltou o responsiblesyndicid e mandar a qo origin
      const dataForCreateHistoryAndReport: ICreateMaintenanceHistoryAndReport = {
        buildingId,
        maintenanceId: updatedsMaintenances[i].id,
        ownerCompanyId: req.Company.id,
        maintenanceStatusId: completedStatus.id,
        notificationDate: updatedsMaintenances[i].resolutionDate,
        resolutionDate: updatedsMaintenances[i].resolutionDate,
        dueDate: updatedsMaintenances[i].resolutionDate,
        MaintenanceReport: {
          create: {
            origin,
            cost: maintenanceToUpdate.maintenanceReport.cost
              ? Number(maintenanceToUpdate.maintenanceReport.cost.replace(/[^0-9]/g, ''))
              : 0,
            observation: maintenanceToUpdate.maintenanceReport.observation
              ? maintenanceToUpdate.maintenanceReport.observation
              : null,
            responsibleSyndicId: null,
            ReportAnnexes: {
              createMany: {
                data: maintenanceToUpdate.files,
              },
            },
            ReportImages: {
              createMany: {
                data: maintenanceToUpdate.images,
              },
            },
          },
        },
      };

      const createdMaintenanceHistory = await sharedMaintenanceServices.createHistoryAndReport({
        data: dataForCreateHistoryAndReport,
      });

      const createdReport = await sharedMaintenanceReportsServices.getReportByMaintenanceHistoryId({
        maintenanceHistoryId: createdMaintenanceHistory.id,
      });

      if (createdReport?.id) {
        await sharedMaintenanceReportsServices.createHistory({
          data: {
            origin,
            maintenanceReportId: createdReport.id,
            maintenanceHistoryId: createdMaintenanceHistory.id,
            cost: maintenanceToUpdate.maintenanceReport.cost
              ? Number(maintenanceToUpdate.maintenanceReport.cost.replace(/[^0-9]/g, ''))
              : 0,
            observation: maintenanceToUpdate.maintenanceReport.observation
              ? maintenanceToUpdate.maintenanceReport.observation
              : null,
            ReportImages: {
              createMany: {
                data: maintenanceToUpdate.images,
              },
            },
            ReportAnnexes: {
              createMany: {
                data: maintenanceToUpdate.files,
              },
            },
          },
        });
      }

      // #endregion

      let notificationDateForSelectedLastResolutionDate = updatedsMaintenances[i].resolutionDate;

      notificationDateForSelectedLastResolutionDate = addDays({
        date: notificationDateForSelectedLastResolutionDate,
        days: updatedsMaintenances[i].frequency * timeIntervalFrequency.unitTime,
      });

      if (
        notificationDateForSelectedLastResolutionDate < today &&
        !updatedsMaintenances[i].notificationDate
      ) {
        throw new ServerMessage({
          statusCode: 400,
          message: `Você deve informar uma data de primeira notificação na manutenção ${updatedsMaintenances[i].element}`,
        });
      }

      notificationDateForSelectedLastResolutionDate = changeTime({
        date: noWeekendTimeDate({
          date: notificationDateForSelectedLastResolutionDate,
          interval: updatedsMaintenances[i].frequency * timeIntervalFrequency.unitTime,
        }),
        time: {
          h: 0,
          m: 0,
          ms: 0,
          s: 0,
        },
      });

      notificationDate = noWeekendTimeDate({
        date: notificationDateForSelectedLastResolutionDate,
        interval: updatedsMaintenances[i].frequency * timeIntervalFrequency.unitTime,
      });

      if (updatedsMaintenances[i].notificationDate !== null) {
        notificationDate = updatedsMaintenances[i].notificationDate;
      }
    }

    const dueDate = noWeekendTimeDate({
      date: addDays({
        date: notificationDate,
        days: updatedsMaintenances[i].period * timeIntervalPeriod.unitTime,
      }),
      interval: updatedsMaintenances[i].frequency * timeIntervalFrequency.unitTime,
    });

    DataForCreateHistory.push({
      buildingId,
      maintenanceId: updatedsMaintenances[i].id,
      ownerCompanyId: req.Company.id,
      maintenanceStatusId: maintenanceStatus.id,
      notificationDate,
      dueDate,
    });
  }

  if (updatedsMaintenances.length)
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
