/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-bitwise */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// # region IMPORTS
import { Request, Response } from 'express';
import { addDays } from '../../../../utils/functions';

// CLASS
import { CompanyServices } from '../../../backoffice/users/accounts/services/companyServices';
import { SharedCalendarServices } from '../../../shared/calendar/services/SharedCalendarServices';
import { SharedMaintenanceServices } from '../../../shared/categories/maintenance/services/sharedMaintenanceServices';

const sharedCalendarServices = new SharedCalendarServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();
const companyServices = new CompanyServices();

// #endregion

export async function listCalendarMaintenances(req: Request, res: Response) {
  // #region VALIDATION

  await companyServices.findById({ companyId: req.Company.id });

  // #endregion

  // #region PROCESS DATA

  const MaintenancesData = await sharedMaintenanceServices.findMaintenancesPerPeriod({
    companyId: req.Company.id,
  });

  const Buildings = sharedCalendarServices.processData({ Maintenances: MaintenancesData });
  // #endregion

  // #region GENERATE FUTURE MAINTENANCES
  const Dates = [];

  for (let i = 0; i < Buildings.length; i++) {
    for (let j = 0; j < Buildings[i].Maintenances.length; j++) {
      const dates = sharedCalendarServices.recurringDates({
        startDate: new Date(Buildings[i].deliveryDate),
        endDate: addDays({ date: Buildings[i].deliveryDate, days: 365 }),
        interval: Buildings[i].Maintenances[j].FrequencyTimeInterval.unitTime,
        maintenanceData: {
          id: Buildings[i].Maintenances[j].id,
          element: Buildings[i].Maintenances[j].element,
        },
      });

      Dates.push(...dates);
    }
  }

  // #endregion

  return res.status(200).json({ Dates });
}
