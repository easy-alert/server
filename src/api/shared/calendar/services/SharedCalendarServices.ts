// TYPES
// import { Validator } from '../../../../utils/validator/validator';
// import { prisma } from '../../../../../prisma';
import { addDays } from '../../../../utils/functions';
import { IMaintenancesData, IRecurringDates } from './types';

// CLASS

// const validator = new Validator();

export class SharedCalendarServices {
  processData({ Maintenances }: IMaintenancesData) {
    const newData = [];

    for (let i = 0; i < Maintenances.length; i++) {
      const TempMaintenances = [];
      for (let j = 0; j < Maintenances[i].Categories.length; j++) {
        for (let k = 0; k < Maintenances[i].Categories[j].Maintenances.length; k++) {
          TempMaintenances.push({ ...Maintenances[i].Categories[j].Maintenances[k].Maintenance });
        }
      }
      newData.push({
        name: Maintenances[i].name,
        deliveryDate: Maintenances[i].deliveryDate,
        Maintenances: TempMaintenances,
      });
    }

    return newData;
  }

  recurringDates({ startDate, endDate, interval, maintenanceData }: IRecurringDates) {
    let date = startDate;
    const dates = [];

    while (date < endDate) {
      dates.push({ ...maintenanceData, date });
      date = addDays({ date, days: interval });
    }

    return dates;
  }
}
