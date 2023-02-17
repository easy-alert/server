export const getMonthDay = (date: Date): number => {
  const dateIsoString = date.toISOString();

  const dateArray = dateIsoString.split('T');

  const dayMonthYear = dateArray[0].split('-');

  return Number(dayMonthYear[2]);
};
