import { hyphenToSlash } from '../dataHandler';
// import { addDays } from './addDays';

export function setToUTCLastMinuteOfDay(date: Date | string) {
  let dateValue = date;

  if (typeof dateValue === 'string') {
    dateValue = hyphenToSlash(String(dateValue)).substring(0, 10);
    dateValue = new Date(dateValue);
  }

  dateValue.setUTCHours(23, 59, 59, 999); // Set to the last minute of the day in UTC
  const midnight = dateValue; // Create a new Date object to avoid mutating the original date

  return midnight;
}
