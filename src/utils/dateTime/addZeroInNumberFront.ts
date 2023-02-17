export const addZeroInNumberFront = (number: number) => {
  if (number >= 0 && number <= 9) return `0${number}`;
  return String(number);
};
