import { hyphenToSlash } from '../dataHandler';

export function setToLastMinuteOfDay(date: Date | string) {
  let dateValue = date;

  if (typeof dateValue === 'string') {
    dateValue = hyphenToSlash(String(dateValue)).substring(0, 10);
    dateValue = new Date(dateValue);
  }

  dateValue.setUTCHours(23, 59, 59, 999); // Set to the last minute of the day in UTC
  const midnight = dateValue;

  return midnight;
}
