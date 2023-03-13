export const DynamicFutureYears = ({ showFutureYears = false }: { showFutureYears: boolean }) => {
  const actualYear = new Date().getFullYear();
  let initialYear = 2020;

  const years = [];

  const finalYear = actualYear + (showFutureYears ? 5 : 0);

  while (initialYear <= finalYear) {
    years.push(initialYear);
    initialYear++;
  }

  return years;
};
