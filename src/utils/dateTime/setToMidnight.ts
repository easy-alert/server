import { hyphenToSlash } from '../dataHandler';

export function setToMidnight(date: Date | string) {
  let dateValue = date;

  if (typeof dateValue === 'string') {
    dateValue = hyphenToSlash(String(dateValue)).substring(0, 10);
    dateValue = new Date(dateValue);
  }

  dateValue.setUTCHours(0, 0, 0, 0);
  const midnight = dateValue;

  return midnight;
}
