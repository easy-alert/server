import { changeUTCTime } from './changeUTCTime';

export function setToUTCMidnight(date: Date | string) {
  const newDate = new Date(date);
  const UTCMidnight = changeUTCTime(newDate, 3, 0, 0, 0);
  return UTCMidnight;
}
