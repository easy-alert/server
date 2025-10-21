import { Router } from 'express';
import { completeTicketChecklistItemController } from './controllers/completeTicketChecklistItemController';
import { createTicketChecklistItemController } from './controllers/createTicketChecklistItemController';
import { deleteTicketChecklistItemController } from './controllers/deleteTicketChecklistItemController';
// import { moveTicketChecklistItemController } from './controllers/moveTicketChecklistItemController';

export const ticketChecklistRouter: Router = Router({ mergeParams: true });

ticketChecklistRouter.post('/', createTicketChecklistItemController);
ticketChecklistRouter.patch('/:itemId', completeTicketChecklistItemController);
ticketChecklistRouter.delete('/:itemId', deleteTicketChecklistItemController);
// ticketChecklistRouter.patch('/:itemId/move', moveTicketChecklistItemController);
