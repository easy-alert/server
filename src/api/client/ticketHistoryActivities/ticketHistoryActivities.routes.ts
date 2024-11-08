import { Router } from 'express';

import { findTicketHistoryActivitiesById } from '../../shared/ticketHistoryActivities/controllers/findTicketHistoryActivitiesById';
import { createTicketHistoryActivity } from '../../shared/ticketHistoryActivities/controllers/createTicketHistoryActivity';

export const ticketHistoryActivitiesRouter: Router = Router();

ticketHistoryActivitiesRouter.get('/:ticketId', findTicketHistoryActivitiesById);

ticketHistoryActivitiesRouter.post('/', createTicketHistoryActivity);
