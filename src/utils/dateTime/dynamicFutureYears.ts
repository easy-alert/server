export const DynamicFutureYears = ({
  initialYear,
  yearsForSum,
}: {
  initialYear: number;
  yearsForSum: number;
}) => {
  const years = [];

  let year = initialYear;

  const finalYear = initialYear + yearsForSum;

  while (year <= finalYear) {
    years.push(String(year));
    year++;
  }

  return years;
};
