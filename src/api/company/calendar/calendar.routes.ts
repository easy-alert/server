// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listCalendarMaintenances } from './controllers';

// ROUTES
export const calendarRouter = Router();

// BUILDING

calendarRouter.get('/list', listCalendarMaintenances);
