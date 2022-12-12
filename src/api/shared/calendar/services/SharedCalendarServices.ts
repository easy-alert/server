// TYPES
// import { Validator } from '../../../../utils/validator/validator';
// import { prisma } from '../../../../../prisma';
import { IAddDays, IMaintenancesData, IRecurringDates } from './types';

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

  addDays({ date, days }: IAddDays) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  }

  recurringDates({ startDate, endDate, interval, maintenanceData }: IRecurringDates) {
    let date = startDate;
    const dates = [];

    while (date < endDate) {
      dates.push({ ...maintenanceData, date });
      date = this.addDays({ date, days: interval });
    }

    return dates;
  }
}
