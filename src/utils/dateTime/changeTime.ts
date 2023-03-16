interface IChangeTime {
  date: Date;
  time: {
    h: number;
    m: number;
    s: number;
    ms: number;
  };
}

export function changeTime({ date, time }: IChangeTime) {
  return new Date(date.setHours(time.h, time.m, time.s, time.ms));
}

export function changeUTCTime({ date, time }: IChangeTime) {
  return new Date(date.setUTCHours(time.h, time.m, time.s, time.ms));
}
