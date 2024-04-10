import { Router } from 'express';
import { findManyTicketsController } from '../../shared/tickets/controllers/findManyTicketsController';
import { findTicketByIdController } from '../../shared/tickets/controllers/findTicketByIdController';
import { findTicketsAuxiliaryDataController } from '../../shared/tickets/controllers/findTicketsAuxiliaryDataController';
import { createTicketController } from '../../shared/tickets/controllers/createTicketController';

export const ticketRouter: Router = Router();

ticketRouter.get('/buildings/:buildingNanoId', findManyTicketsController);
ticketRouter.get('/:ticketId', findTicketByIdController);
ticketRouter.get('/extras/auxiliary-data', findTicketsAuxiliaryDataController);

ticketRouter.post('/', createTicketController);
