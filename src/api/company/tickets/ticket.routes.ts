import { Router } from 'express';
import { findManyTicketsController } from '../../shared/tickets/controllers/findManyTicketsController';
import { findTicketByIdController } from '../../shared/tickets/controllers/findTicketByIdController';
import { findTicketsAuxiliaryDataController } from '../../shared/tickets/controllers/findTicketsAuxiliaryDataController';
import { findOccasionalMaintenancesForTicketsController } from '../../shared/tickets/controllers/findOccasionalMaintenancesForTicketsController';
import { connectTicketsToExistingMaintenancesController } from '../../shared/tickets/controllers/connectTicketsToExistingMaintenancesController';
import { deleteTicketController } from '../../shared/tickets/controllers/deleteTicketController';
import { findTicketReportController } from '../../shared/tickets/controllers/findTicketReportController';

export const ticketRouter: Router = Router();

ticketRouter.get('/reports', findTicketReportController);
ticketRouter.get('/buildings/:buildingNanoId', findManyTicketsController);
ticketRouter.get('/:ticketId', findTicketByIdController);
ticketRouter.get('/extras/auxiliary-data', findTicketsAuxiliaryDataController);
ticketRouter.get(
  '/extras/occasional-maintenances/:buildingNanoId',
  findOccasionalMaintenancesForTicketsController,
);

// ticketRouter.post('/', createTicketController);
ticketRouter.post('/connect-to-maintenance', connectTicketsToExistingMaintenancesController);

ticketRouter.delete('/:ticketId', deleteTicketController);
