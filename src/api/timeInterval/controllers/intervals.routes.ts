// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listTimeIntervals } from './listTimeIntervals';

// ROUTES
export const TimeIntervalRouter = Router();

TimeIntervalRouter.get('/list', listTimeIntervals);
