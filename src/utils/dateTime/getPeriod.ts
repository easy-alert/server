import { removeDays } from './removeTimeDate';
import { setToUTCLastMinuteOfDay } from './setToUTCLastMinuteOfDay';

export function getPeriod(period: number | string = 365) {
  const endDate = setToUTCLastMinuteOfDay(new Date());

  const startDate = removeDays({
    date: endDate,
    days: Number(period),
  });

  return { startDate, endDate };
}
