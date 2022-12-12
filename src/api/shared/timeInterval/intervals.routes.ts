// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listTimeIntervals } from './controllers/listTimeIntervals';

// ROUTES
export const TimeIntervalRouter = Router();

TimeIntervalRouter.get('/list', listTimeIntervals);
