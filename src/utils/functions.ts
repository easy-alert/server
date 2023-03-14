interface IAddDays {
  date: Date;
  days: number;
}

export function addDays({ date, days }: IAddDays) {
  const newDate = new Date(date);
  newDate.setDate(date.getUTCDate() + days);
  return newDate;
}
