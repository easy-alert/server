// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listCalendarCalled } from './controllers/listCalendarCalled';

// ROUTES
export const calendarCalledRouter = Router();

calendarCalledRouter.get('/list/:year', listCalendarCalled);
