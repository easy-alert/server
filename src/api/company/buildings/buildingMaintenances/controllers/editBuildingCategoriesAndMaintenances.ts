// #region IMPORTS
import { Request, Response } from 'express';

import { SharedCategoryServices } from '../../../../shared/categories/services/sharedCategoryServices';
import { SharedMaintenanceServices } from '../../../../shared/maintenance/services/sharedMaintenanceServices';
import { ICreateMaintenanceHistoryAndReport } from '../../../../shared/maintenance/services/types';
import { SharedMaintenanceStatusServices } from '../../../../shared/maintenanceStatus/services/sharedMaintenanceStatusServices';
import { TimeIntervalServices } from '../../../../shared/timeInterval/services/timeIntervalServices';
import { BuildingServices } from '../../building/services/buildingServices';
import { BuildingMaintenanceHistoryServices } from '../../buildingMaintenancesHistory/services/buildingMaintenanceHistoryServices';
import { BuildingCategoryAndMaintenanceServices } from '../services/buildingCategoryAndMaintenanceServices';
import { getCompanyLastServiceOrder } from '../../../../shared/maintenanceHistory/services/getCompanyLastServiceOrder';
import { SharedMaintenanceReportsServices } from '../../../../shared/maintenancesReports/services/SharedMaintenanceReportsServices';

import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { changeTime } from '../../../../../utils/dateTime/changeTime';
import { addDays, removeDays } from '../../../../../utils/dateTime';
import { noWeekendTimeDate } from '../../../../../utils/dateTime/noWeekendTimeDate';
import { Validator } from '../../../../../utils/validator/validator';

import type { IDateForCreateHistory, IMaintenancesForHistorySelected } from './types';

// CLASS

const validator = new Validator();
const buildingCategoryAndMaintenanceServices = new BuildingCategoryAndMaintenanceServices();
const sharedCategoryServices = new SharedCategoryServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();
const buildingServices = new BuildingServices();
const timeIntervalServices = new TimeIntervalServices();
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
        bodyData[i].Maintenances[j].isSelected &&
        bodyData[i].Maintenances[j].resolutionDate &&
        new Date(bodyData[i].Maintenances[j].resolutionDate) > today
      ) {
        throw new ServerMessage({
          statusCode: 400,
          message: 'A data da última conclusão deve ser menor ou igual a hoje',
        });
      }

      if (
        bodyData[i].Maintenances[j].isSelected &&
        bodyData[i].Maintenances[j].notificationDate &&
        new Date(bodyData[i].Maintenances[j].notificationDate) < today
      ) {
        throw new ServerMessage({
          statusCode: 400,
          message: 'A data da próxima notificação deve ser maior que hoje',
        });
      }

      if (bodyData[i].Maintenances[j].daysToAnticipate) {
        const timeIntervalFrequency = await timeIntervalServices.findById({
          timeIntervalId: bodyData[i].Maintenances[j].FrequencyTimeInterval.id,
        });
        // tá repetido lá em baixo mais 2x
        const sixMonthsInDays = 30 * 6;
        const daysToAnticipate = bodyData[i].Maintenances[j].daysToAnticipate || 0;
        const frequency = bodyData[i].Maintenances[j].frequency * timeIntervalFrequency.unitTime;
        const canAnticipate = frequency >= sixMonthsInDays;
        const maxDaysToAnticipate = frequency / 2;

        if (bodyData[i].Maintenances[j].isSelected && !canAnticipate) {
          throw new ServerMessage({
            statusCode: 400,
            message: `A manutenção ${bodyData[i].Maintenances[j].element} não pode ser antecipada, pois ela precisa ter uma periodicidade mínima de 6 meses.`,
          });
        }

        if (bodyData[i].Maintenances[j].isSelected && daysToAnticipate > maxDaysToAnticipate) {
          throw new ServerMessage({
            statusCode: 400,
            message: `O limite de antecipação da manutenção ${
              bodyData[i].Maintenances[j].element
            } é de ${Math.floor(maxDaysToAnticipate)} dias.`,
          });
        }
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
        maintenancesForCreate.push({
          maintenanceId: bodyData[i].Maintenances[j].id,
          daysToAnticipate: bodyData[i].Maintenances[j].daysToAnticipate,
        });

        maintenancesForHistorySelected.push({
          maintenanceId: bodyData[i].Maintenances[j].id,
          status: bodyData[i].Maintenances[j].status,
          inProgress: bodyData[i].Maintenances[j].inProgress || false,
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
      inProgress: maintenancesForCreateHistory[i].inProgress,
      status: maintenancesForCreateHistory[i].status,
    };
  }

  let notificationDate = null;
  let dueDate = null;

  for (let i = 0; i < updatedsMaintenances.length; i++) {
    let lastServiceOrderNumber = 0;

    lastServiceOrderNumber = await getCompanyLastServiceOrder({
      companyId: req.Company.id,
    });

    const updatedMaintenanceStatus = await sharedMaintenanceStatusServices.findByName({
      name: updatedsMaintenances[i].status || 'pending',
    });

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
        interval: updatedsMaintenances[i].period * timeIntervalPeriod.unitTime,
      }),
      time: {
        h: 0,
        m: 0,
        ms: 0,
        s: 0,
      },
    });

    // #endregion

    const categoryToUpdate = bodyData.find(
      (data: any) => data.categoryId === updatedsMaintenances[i].categoryId,
    );

    const maintenanceToUpdate = categoryToUpdate.Maintenances.find(
      (maintenance: any) => maintenance.id === updatedsMaintenances[i].id,
    );

    // periodicidade mínima de 6 meses pra antecipar
    const sixMonthsInDays = 30 * 6;
    const daysToAnticipate = maintenanceToUpdate.daysToAnticipate || 0;
    const frequency = updatedsMaintenances[i].frequency * timeIntervalFrequency.unitTime;
    const canAnticipate = frequency >= sixMonthsInDays;
    const maxDaysToAnticipate = frequency / 2;

    let firstMaintenanceWasAntecipated = false;

    if (updatedsMaintenances[i].resolutionDate === null) {
      // console.log('aqui é a notificação quando não manda data de resolução');

      notificationDate = noWeekendTimeDate({
        date: addDays({
          date: buildingDeliveryDate,
          days:
            updatedsMaintenances[i].frequency * timeIntervalFrequency.unitTime +
            updatedsMaintenances[i].delay * timeIntervalDelay.unitTime,
        }),
        interval: updatedsMaintenances[i].period * timeIntervalPeriod.unitTime,
      });

      if (buildingDeliveryDate < today) {
        notificationDate = noWeekendTimeDate({
          date: notificationDateForOldBuildingDeliveries,
          interval: updatedsMaintenances[i].period * timeIntervalPeriod.unitTime,
        });
      }

      // antecipar aqui
      if (daysToAnticipate) {
        if (!canAnticipate) {
          throw new ServerMessage({
            statusCode: 400,
            message: `A manutenção ${updatedsMaintenances[i].element} não pode ser antecipada, pois ela precisa ter uma periodicidade mínima de 6 meses.`,
          });
        }

        if (daysToAnticipate > maxDaysToAnticipate) {
          throw new ServerMessage({
            statusCode: 400,
            message: `O limite de antecipação da manutenção ${
              updatedsMaintenances[i].element
            } é de ${Math.floor(maxDaysToAnticipate)} dias.`,
          });
        }

        notificationDate = noWeekendTimeDate({
          date: removeDays({ date: notificationDate, days: daysToAnticipate }),
          interval: updatedsMaintenances[i].period * timeIntervalPeriod.unitTime,
        });

        firstMaintenanceWasAntecipated = true;
      }

      if (updatedsMaintenances[i].notificationDate !== null) {
        firstMaintenanceWasAntecipated = false;
        notificationDate = updatedsMaintenances[i].notificationDate;
        // console.log('entra quando tem a notificação');
      }

      dueDate = noWeekendTimeDate({
        date: addDays({
          date: notificationDate,
          days:
            updatedsMaintenances[i].period * timeIntervalPeriod.unitTime +
            // só soma os dias se não tiver primeira data de notificação
            (firstMaintenanceWasAntecipated ? daysToAnticipate : 0),
        }),
        interval: updatedsMaintenances[i].period * timeIntervalPeriod.unitTime,
      });
    } else if (updatedsMaintenances[i].status === 'pending') {
      const updatedNotificationDate = updatedsMaintenances[i].resolutionDate;

      notificationDate = updatedNotificationDate;

      dueDate = noWeekendTimeDate({
        date: addDays({
          date: notificationDate,
          days:
            updatedsMaintenances[i].period * timeIntervalPeriod.unitTime +
            // só soma os dias se não tiver primeira data de notificação
            (firstMaintenanceWasAntecipated ? daysToAnticipate : 0),
        }),
        interval: updatedsMaintenances[i].period * timeIntervalPeriod.unitTime,
      });
    } else if (updatedsMaintenances[i].status === 'expired') {
      const updatedDueDate = updatedsMaintenances[i].resolutionDate;

      notificationDate = noWeekendTimeDate({
        date: removeDays({
          date: updatedDueDate,
          days: updatedsMaintenances[i].period,
        }),
        interval: updatedsMaintenances[i].period * timeIntervalPeriod.unitTime,
      });

      dueDate = updatedDueDate;

      lastServiceOrderNumber = await getCompanyLastServiceOrder({
        companyId: req.Company.id,
      });

      const expiredMaintenance = await sharedMaintenanceServices.createOneHistory({
        data: {
          ownerCompanyId: req.Company.id,
          buildingId,
          maintenanceId: updatedsMaintenances[i].id,
          maintenanceStatusId: updatedMaintenanceStatus.id,
          daysInAdvance: firstMaintenanceWasAntecipated ? daysToAnticipate : 0,
          serviceOrderNumber: lastServiceOrderNumber + 1,
          notificationDate,
          dueDate,
          inProgress: updatedsMaintenances[i].inProgress,
        },
      });

      const nextMaintenanceHistory = await sharedMaintenanceServices.findHistoryById({
        maintenanceHistoryId: expiredMaintenance.id,
      });

      const foundBuildingMaintenance =
        await buildingServices.findBuildingMaintenanceDaysToAnticipate({
          buildingId: nextMaintenanceHistory.Building.id,
          maintenanceId: nextMaintenanceHistory.Maintenance.id,
        });

      const nextNotificationDate = noWeekendTimeDate({
        date: addDays({
          date:
            // Escolhe se cria a pendente a partir da execução ou da notificação da anterior
            nextMaintenanceHistory.Building.nextMaintenanceCreationBasis === 'executionDate'
              ? today
              : notificationDate,
          days:
            nextMaintenanceHistory.Maintenance.frequency *
              nextMaintenanceHistory.Maintenance.FrequencyTimeInterval.unitTime -
            (foundBuildingMaintenance?.daysToAnticipate ?? 0),
        }),
        interval:
          nextMaintenanceHistory.Maintenance.period *
          nextMaintenanceHistory.Maintenance.PeriodTimeInterval.unitTime,
      });

      const nextDueDate = noWeekendTimeDate({
        date: addDays({
          date: nextNotificationDate,
          days:
            nextMaintenanceHistory.Maintenance.period *
              nextMaintenanceHistory.Maintenance.PeriodTimeInterval.unitTime +
            (foundBuildingMaintenance?.daysToAnticipate ?? 0),
        }),
        interval:
          nextMaintenanceHistory.Maintenance.period *
          nextMaintenanceHistory.Maintenance.PeriodTimeInterval.unitTime,
      });

      const pendingStatus = await sharedMaintenanceStatusServices.findByName({ name: 'pending' });

      lastServiceOrderNumber = await getCompanyLastServiceOrder({
        companyId: req.Company.id,
      });

      await sharedMaintenanceServices.createHistory({
        data: [
          {
            ownerCompanyId: nextMaintenanceHistory.Company.id,
            maintenanceId: nextMaintenanceHistory.Maintenance.id,
            buildingId: nextMaintenanceHistory.Building.id,
            maintenanceStatusId: pendingStatus.id,
            notificationDate: nextNotificationDate,
            dueDate: nextDueDate,
            daysInAdvance: foundBuildingMaintenance?.daysToAnticipate ?? 0,
            serviceOrderNumber: lastServiceOrderNumber + 1,
          },
        ],
      });

      continue;
    } else if (
      updatedsMaintenances[i].status === 'completed' ||
      updatedsMaintenances[i].status === 'overdue'
    ) {
      // #region Create History for maintenanceHistory
      lastServiceOrderNumber = await getCompanyLastServiceOrder({
        companyId: req.Company.id,
      });

      const dataForCreateHistoryAndReport: ICreateMaintenanceHistoryAndReport = {
        ownerCompanyId: req.Company.id,
        buildingId,
        maintenanceId: updatedsMaintenances[i].id,
        maintenanceStatusId: updatedMaintenanceStatus.id,
        notificationDate: updatedsMaintenances[i].resolutionDate,
        resolutionDate: updatedsMaintenances[i].resolutionDate,
        dueDate: updatedsMaintenances[i].resolutionDate,
        serviceOrderNumber: lastServiceOrderNumber + 1,
        inProgress: false,

        MaintenanceReport: {
          create: {
            origin,
            cost: maintenanceToUpdate.maintenanceReport?.cost
              ? Number(maintenanceToUpdate.maintenanceReport.cost.replace(/[^0-9]/g, ''))
              : 0,
            observation: maintenanceToUpdate.maintenanceReport?.observation
              ? maintenanceToUpdate.maintenanceReport.observation
              : null,
            responsibleSyndicId: null,
            ReportAnnexes: {
              createMany: {
                data: Array.isArray(maintenanceToUpdate.files) ? maintenanceToUpdate.files : [],
              },
            },
            ReportImages: {
              createMany: {
                data: Array.isArray(maintenanceToUpdate.images) ? maintenanceToUpdate.images : [],
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
            cost: maintenanceToUpdate.maintenanceReport?.cost
              ? Number(maintenanceToUpdate.maintenanceReport.cost.replace(/[^0-9]/g, ''))
              : 0,
            observation: maintenanceToUpdate.maintenanceReport?.observation
              ? maintenanceToUpdate.maintenanceReport.observation
              : null,

            ReportImages: {
              createMany: {
                data: Array.isArray(maintenanceToUpdate.images) ? maintenanceToUpdate.images : [],
              },
            },

            ReportAnnexes: {
              createMany: {
                data: Array.isArray(maintenanceToUpdate.files) ? maintenanceToUpdate.files : [],
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
      // console.log('essa é a data que gera automatico quando não manda nada');

      // conferir aqui, o front deixa 1 dia a menos
      if (
        removeDays({
          date: notificationDateForSelectedLastResolutionDate,
          days: daysToAnticipate,
        }) < today &&
        !updatedsMaintenances[i].notificationDate
      ) {
        throw new ServerMessage({
          statusCode: 400,
          message: `Você deve informar uma data de próxima notificação na manutenção ${updatedsMaintenances[i].element}`,
        });
      }

      notificationDateForSelectedLastResolutionDate = changeTime({
        date: noWeekendTimeDate({
          date: notificationDateForSelectedLastResolutionDate,
          interval: updatedsMaintenances[i].period * timeIntervalPeriod.unitTime,
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
        interval: updatedsMaintenances[i].period * timeIntervalPeriod.unitTime,
      });

      // antecipar aqui
      if (daysToAnticipate) {
        if (!canAnticipate) {
          throw new ServerMessage({
            statusCode: 400,
            message: `A manutenção ${updatedsMaintenances[i].element} não pode ser antecipada, pois ela precisa ter uma periodicidade mínima de 6 meses.`,
          });
        }

        if (daysToAnticipate > maxDaysToAnticipate) {
          throw new ServerMessage({
            statusCode: 400,
            message: `O limite de antecipação da manutenção ${
              updatedsMaintenances[i].element
            } é de ${Math.floor(maxDaysToAnticipate)} dias.`,
          });
        }

        notificationDate = noWeekendTimeDate({
          date: removeDays({ date: notificationDate, days: daysToAnticipate }),
          interval: updatedsMaintenances[i].period * timeIntervalPeriod.unitTime,
        });
        firstMaintenanceWasAntecipated = true;
      }

      if (updatedsMaintenances[i].notificationDate !== null) {
        firstMaintenanceWasAntecipated = false;
        notificationDate = updatedsMaintenances[i].notificationDate;
        // console.log('entra aqui quando tem os dois');
      }

      dueDate = noWeekendTimeDate({
        date: addDays({
          date: notificationDate,
          days:
            updatedsMaintenances[i].period * timeIntervalPeriod.unitTime +
            // só soma os dias se não tiver primeira data de notificação
            (firstMaintenanceWasAntecipated ? daysToAnticipate : 0),
        }),
        interval: updatedsMaintenances[i].period * timeIntervalPeriod.unitTime,
      });
    }

    // SOMANDO OS DIAS ANTECIPADOS NOVAMENTE NA DATA DE RESOLUÇÃO,
    // se nao ela ia descontar o que foi antecipado
    // se não existir é zero entao ok.

    lastServiceOrderNumber = await getCompanyLastServiceOrder({
      companyId: req.Company.id,
    });

    DataForCreateHistory.push({
      ownerCompanyId: req.Company.id,
      buildingId,
      maintenanceId: updatedsMaintenances[i].id,
      maintenanceStatusId: updatedMaintenanceStatus.id,
      daysInAdvance: firstMaintenanceWasAntecipated ? daysToAnticipate : 0,
      serviceOrderNumber: lastServiceOrderNumber + 1,
      notificationDate,
      dueDate,
      inProgress: updatedsMaintenances[i].inProgress || false,
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
