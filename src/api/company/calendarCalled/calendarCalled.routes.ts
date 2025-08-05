// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listCalendarTickets } from './controllers/listCalendarCalled';

// ROUTES
export const calendarTicketsRouter = Router();

calendarTicketsRouter.get('/list/:year', listCalendarTickets);
