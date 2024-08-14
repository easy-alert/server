import { addDays } from './addDays';
import { changeUTCTime } from './changeTime';

export function setToUTCLastMinuteOfDay(date: Date | string) {
  const newDate = new Date(date);
  const adjustedDate = changeUTCTime({ date: newDate, time: { h: 2, m: 59, s: 59, ms: 999 } });
  const lastMinuteOfDay = addDays({ date: adjustedDate, days: 1 });
  return lastMinuteOfDay;
}
