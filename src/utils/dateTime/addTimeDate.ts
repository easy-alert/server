import { ITimeDate } from './types';

export const addTimeDate = ({ date, days, minutes }: ITimeDate) => {
  let newDate = new Date(date);

  if (days) {
    newDate.setDate(newDate.getUTCDate() + days);
  }
  if (minutes) {
    newDate = new Date(newDate.getTime() + minutes * 60000);
  }

  return newDate;
};
