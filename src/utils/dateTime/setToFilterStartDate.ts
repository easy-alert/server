import { changeUTCTime } from './changeTime';

export function setToFilterStartDate(date: string | undefined) {
  return date
    ? changeUTCTime({ date: new Date(date), time: { h: 3, m: 0, ms: 0, s: 0 } })
    : undefined;
}
