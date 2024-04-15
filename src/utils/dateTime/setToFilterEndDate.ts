import { addDays } from './addDays';
import { changeUTCTime } from './changeTime';

export function setToFilterEndDate(date: string | undefined) {
  return date
    ? addDays({
        date: changeUTCTime({ date: new Date(date), time: { h: 2, m: 59, ms: 59, s: 0 } }),
        days: 1,
      })
    : undefined;
}
