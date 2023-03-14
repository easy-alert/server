import { addDays } from './addDays';
import { removeDays } from './removeTimeDate';

export const noWeekendTimeDate = ({ date, interval }: { date: Date; interval: number }) => {
  let dateNoWeekend;

  switch (date.getUTCDay()) {
    case 0:
      dateNoWeekend = addDays({
        date,
        days: 1,
      });

      break;
    case 6:
      if (interval === 1) {
        dateNoWeekend = addDays({
          date,
          days: 2,
        });
        break;
      } else {
        dateNoWeekend = removeDays({
          date,
          days: 1,
        });
        break;
      }

    default:
      dateNoWeekend = date;
      break;
  }

  return dateNoWeekend;
};
