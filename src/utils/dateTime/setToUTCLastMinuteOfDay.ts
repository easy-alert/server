import { hyphenToSlash } from '../dataHandler';
import { changeTime } from './changeTime';

export function setToUTCLastMinuteOfDay(date: Date | string) {
  let dateValue = date;

  if (typeof dateValue === 'string') {
    dateValue = hyphenToSlash(String(dateValue)).substring(0, 10);
  }

  const newDate = new Date(dateValue);
  const endOfDay = changeTime({ date: newDate, time: { h: 23, m: 59, s: 59, ms: 999 } });
  return endOfDay;
}
