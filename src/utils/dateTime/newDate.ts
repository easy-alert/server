interface INewDate {
  date: Date;
  time?: {
    h: number;
    m: number;
    s: number;
    ms: number;
  };
}

export function newDate({ date, time }: INewDate) {
  if (time) return new Date(date.setHours(time.h, time.m, time.s, time.ms));

  return new Date();
}
