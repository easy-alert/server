// TYPES
import { Request, Response } from 'express';

// CLASS
import { TimeIntervalServices } from '../services/timeIntervalServices';

const timeIntervalsServices = new TimeIntervalServices();

export const listTimeIntervals = async (_req: Request, res: Response) => {
  const intervals = await timeIntervalsServices.list();

  return res.status(200).json(intervals);
};
