// #region IMPORTS
import { Request, Response } from 'express';
import { noWeekendTimeDate } from '../../../../../utils/dateTime/noWeekendTimeDate';
import { addDays } from '../../../../../utils/functions';
import { Validator } from '../../../../../utils/validator/validator';
import { SharedCategoryServices } from '../../../../shared/categories/services/sharedCategoryServices';
import { SharedMaintenanceServices } from '../../../../shared/maintenance/services/sharedMaintenanceServices';
import { SharedMaintenanceStatusServices } from '../../../../shared/maintenanceStatus/services/sharedMaintenanceStatusServices';
import { TimeIntervalServices } from '../../../../shared/timeInterval/services/timeIntervalServices';
import { BuildingServices } from '../../building/services/buildingServices';
import { BuildingMaintenanceHistoryServices } from '../../buildingMaintenancesHistory/services/buildingMaintenanceHistoryServices';
import { BuildingCategoryAndMaintenanceServices } from '../services/buildingCategoryAndMaintenanceServices';
import { ICreateBuildingCategory } from '../services/types';
import { IDateForCreateHistory } from './types';

// CLASS

const validator = new Validator();
const buildingCategoryAndMaintenanceServices = new BuildingCategoryAndMaintenanceServices();
const sharedCategoryServices = new SharedCategoryServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();
const buildingServices = new BuildingServices();
const timeIntervalServices = new TimeIntervalServices();
const maintenancesStatusServices = new SharedMaintenanceStatusServices();
const buildingMaintenancesHistoryServices = new BuildingMaintenanceHistoryServices();
// #endregion

export async function editBuildingCategoriesAndMaintenances(req: Request, res: Response) {
  const { buildingId } = req.body;
  const bodyData = req.body.data;

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

      await sharedMaintenanceServices.findById({ maintenanceId: bodyData[i].Maintenances[j].id });
    }
  }

  // #endregion

  // #region DELETING OLD DATA
  const existsMaintenances = await buildingCategoryAndMaintenanceServices.findByBuldingId({
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

  for (let i = 0; i < bodyData.length; i++) {
    for (let j = 0; j < bodyData[i].Maintenances.length; j++) {
      maintenances.push({ maintenanceId: bodyData[i].Maintenances[j].id });
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

  for (let i = 0; i < maintenances.length; i++) {
    // getting maintenances data
    const maintenance: any = await sharedMaintenanceServices.findById({
      maintenanceId: maintenances[i].maintenanceId,
    });
    maintenances[i] = maintenance;
  }

  for (let i = 0; i < maintenances.length; i++) {
    const timeIntervalDelay = await timeIntervalServices.findById({
      timeIntervalId: maintenances[i].delayTimeIntervalId,
    });

    // const timeIntervalPeriod = await timeIntervalServices.findById({
    //   timeIntervalId: maintenances[i].periodTimeIntervalId,
    // });

    const timeIntervalFrequency = await timeIntervalServices.findById({
      timeIntervalId: maintenances[i].frequencyTimeIntervalId,
    });

    const notificationDate = noWeekendTimeDate({
      date: addDays({
        date: buildingDeliveryDate,
        days:
          maintenances[i].frequency * timeIntervalFrequency.unitTime +
          maintenances[i].delay * timeIntervalDelay.unitTime,
      }),
      interval: maintenances[i].delay * timeIntervalDelay.unitTime,
    });

    const dueDate = noWeekendTimeDate({
      date: addDays({
        date: notificationDate,
        days: maintenances[i].frequency * timeIntervalFrequency.unitTime,
      }),
      interval: maintenances[i].frequency * timeIntervalFrequency.unitTime,
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
