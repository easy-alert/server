import { hyphenToSlash } from '../dataHandler';

export function setToUTCMidnight(date: Date | string) {
  let dateValue = date;

  if (typeof dateValue === 'string') {
    dateValue = hyphenToSlash(String(dateValue)).substring(0, 10);
    dateValue = new Date(dateValue);
  }

  dateValue.setUTCHours(3, 0, 0, 0);
  const midnight = dateValue;

  return midnight;
}
