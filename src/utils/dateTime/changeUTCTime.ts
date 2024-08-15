export function changeUTCTime(
  date: Date,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
) {
  const newDate = new Date(date);
  newDate.setUTCHours(hours, minutes, seconds, milliseconds);
  return newDate;
}
