import { addDays } from './addDays';
import { changeUTCTime } from './changeTime';

export function setToUTCLastMinuteOfDay(date: Date) {
  return addDays({
    date: changeUTCTime({
      date,
      time: { h: 2, m: 59, s: 59, ms: 0 },
    }),
    days: 1,
  });
}
