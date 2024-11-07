import { Router } from 'express';

import { findTicketHistoryActivitiesById } from '../../shared/ticketHistoryActivities/controllers/findTicketHistoryActivitiesById';

export const ticketHistoryActivitiesRouter: Router = Router();

ticketHistoryActivitiesRouter.get('/:ticketId', findTicketHistoryActivitiesById);
