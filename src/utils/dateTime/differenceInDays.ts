export function differenceInDays(date1: Date, date2: Date): number {
  const time1 = date1.getTime();
  const time2 = date2.getTime();

  const diffInMilliseconds = Math.abs(time2 - time1);

  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

  return diffInDays;
}
