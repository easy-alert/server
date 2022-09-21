// TYPES
import { Request, Response } from 'express';

// CLASS
import { TimeIntervalServices } from '../services/timeIntervalServices';

const timeIntervalsServices = new TimeIntervalServices();

export const listTimeIntervals = async (_req: Request, res: Response) => {
  const intervals = await timeIntervalsServices.list();

  for (let i = 0; i < intervals.length; i += 1) {
    switch (intervals[i].name) {
      case 'Day':
        intervals[i].name = 'Dia';
        break;
      case 'Week':
        intervals[i].name = 'Semana';
        break;
      case 'Month':
        intervals[i].name = 'Mês';
        break;
      case 'Year':
        intervals[i].name = 'Ano';
        break;

      default:
        break;
    }
  }

  return res.status(200).json(intervals);
};
