interface INewDate {
  date?: string;
  time?: {
    h: number;
    m: number;
    s: number;
    ms: number;
  };
}

export function newDate({ date = Date(), time }: INewDate) {
  if (time) return new Date(new Date(date).setHours(time.h, time.m, time.s, time.ms));

  return new Date();
}
