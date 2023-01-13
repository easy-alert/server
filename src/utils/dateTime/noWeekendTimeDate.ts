import { addTimeDate } from './addTimeDate';
import { removeTimeDate } from './removeTimeDate';

export const noWeekendTimeDate = ({ date, interval }: { date: Date; interval: number }) => {
  let dateNoWeekend;

  switch (date.getUTCDay()) {
    case 0:
      dateNoWeekend = addTimeDate({
        date,
        days: 1,
      });

      break;
    case 6:
      if (interval < 2) {
        dateNoWeekend = addTimeDate({
          date,
          days: 2,
        });
      }
      dateNoWeekend = removeTimeDate({
        date,
        days: 1,
      });

      break;

    default:
      dateNoWeekend = date;
      break;
  }

  return dateNoWeekend;
};
