export const dateHandler = (date: Date) => {
  const dateIsoString = date.toISOString();

  const dateArray = dateIsoString.split('T');

  const dayMonthYear = dateArray[0].split('-');

  const newDate = `${dayMonthYear[1]}-${dayMonthYear[2]}-${dayMonthYear[0]} ${dateArray[1]}`;

  return new Date(newDate);
};
