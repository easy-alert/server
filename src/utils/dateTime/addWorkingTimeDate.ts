import { IAddWorkingTimeDate } from './types';

export const addWorkingTimeDate = ({ date, days }: IAddWorkingTimeDate) => {
  const workingDate = new Date(
    new Date(date).toLocaleDateString('pt-BR', {
      timeZone: 'UTC',
    }),
  );

  let daysCount = 0;

  while (daysCount < days) {
    workingDate.setDate(workingDate.getUTCDate() + 1);

    if (workingDate.getUTCDay() !== 0 && workingDate.getUTCDay() !== 6) {
      daysCount++;
    }
  }

  return workingDate;
};
