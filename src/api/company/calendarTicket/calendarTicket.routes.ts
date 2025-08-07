// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listCalendarTickets } from './controllers/listCalendarTickets';

// ROUTES
export const calendarTicketsRouter = Router();

calendarTicketsRouter.get('/list', listCalendarTickets);
