import { Router } from 'express';
import { findManyTicketsController } from '../../shared/tickets/controllers/findManyTicketsController';
import { findTicketByIdController } from '../../shared/tickets/controllers/findTicketByIdController';
import { findTicketsAuxiliaryDataController } from '../../shared/tickets/controllers/findTicketsAuxiliaryDataController';
import { findOccasionalMaintenancesForTicketsController } from '../../shared/tickets/controllers/findOccasionalMaintenancesForTicketsController';
import { connectTicketsToExistingMaintenancesController } from '../../shared/tickets/controllers/connectTicketsToExistingMaintenancesController';

export const ticketRouter: Router = Router();

ticketRouter.get('/buildings/:buildingNanoId', findManyTicketsController);
ticketRouter.get('/:ticketId', findTicketByIdController);
ticketRouter.get('/extras/auxiliary-data', findTicketsAuxiliaryDataController);
ticketRouter.get('/extras/occasional-maintenances', findOccasionalMaintenancesForTicketsController);

// ticketRouter.post('/', createTicketController);
ticketRouter.post('/connect-to-maintenance', connectTicketsToExistingMaintenancesController);
