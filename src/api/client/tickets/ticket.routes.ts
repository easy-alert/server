import { Router } from 'express';
import { findManyTicketsController } from '../../shared/tickets/controllers/findManyTicketsController';
import { findTicketByIdController } from '../../shared/tickets/controllers/findTicketByIdController';
import { findTicketsAuxiliaryDataController } from '../../shared/tickets/controllers/findTicketsAuxiliaryDataController';
import { createTicketController } from '../../shared/tickets/controllers/createTicketController';
import { findOccasionalMaintenancesForTicketsController } from '../../shared/tickets/controllers/findOccasionalMaintenancesForTicketsController';
import { connectTicketsToExistingMaintenancesController } from '../../shared/tickets/controllers/connectTicketsToExistingMaintenancesController';
import { updateTicketById } from '../../shared/tickets/controllers/updateTicketById';

export const ticketRouter: Router = Router();

ticketRouter.post('/', createTicketController);

ticketRouter.get('/:ticketId', findTicketByIdController);
ticketRouter.put('/:ticketId', updateTicketById);
ticketRouter.get('/buildings/:buildingNanoId', findManyTicketsController);

ticketRouter.get('/extras/auxiliary-data', findTicketsAuxiliaryDataController);
ticketRouter.get(
  '/extras/occasional-maintenances/:buildingNanoId',
  findOccasionalMaintenancesForTicketsController,
);

ticketRouter.post('/connect-to-maintenance', connectTicketsToExistingMaintenancesController);
