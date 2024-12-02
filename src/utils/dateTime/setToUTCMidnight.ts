import { hyphenToSlash } from '../dataHandler';
import { changeTime } from './changeTime';

export function setToUTCMidnight(date: Date | string) {
  let dateValue = date;

  if (typeof dateValue === 'string') {
    dateValue = hyphenToSlash(String(dateValue)).substring(0, 10);
  }

  const newDate = new Date(dateValue);
  const midnight = changeTime({ date: newDate, time: { h: 0, m: 0, s: 0, ms: 0 } });
  return midnight;
}
