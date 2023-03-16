import { ITimeDate } from './types';

export const addDays = ({ date, days }: ITimeDate) => {
  const newDate = new Date(date);

  if (days) {
    newDate.setDate(newDate.getDate() + days);
  }

  return newDate;
};
