import { Router } from 'express';

import { findManyTicketsController } from '../../shared/tickets/controllers/findManyTicketsController';
import { findTicketByIdController } from '../../shared/tickets/controllers/findTicketByIdController';
import { findTicketsAuxiliaryDataController } from '../../shared/tickets/controllers/findTicketsAuxiliaryDataController';
import { findOccasionalMaintenancesForTicketsController } from '../../shared/tickets/controllers/findOccasionalMaintenancesForTicketsController';
import { connectTicketsToExistingMaintenancesController } from '../../shared/tickets/controllers/connectTicketsToExistingMaintenancesController';
import { deleteTicketController } from '../../shared/tickets/controllers/deleteTicketController';
import { createTicketController } from '../../shared/tickets/controllers/createTicketController';
import { updateTicketById } from '../../shared/tickets/controllers/updateTicketById';
import { findAllTicketPlaces } from '../../shared/ticketPlaces/controllers/findAllTicketPlaces';
import { findAllStatus } from '../../shared/ticketStatus/controllers/findAllStatus';
import { generateTicketReportPDF } from '../reports/controllers/generateTicketReportPDF';
import { listTicketsByCompanyId } from '../reports/controllers/listTicketsByCompanyId';

export const ticketRouter: Router = Router();

ticketRouter.post('/', createTicketController);

ticketRouter.get('/:ticketId', findTicketByIdController);
ticketRouter.put('/:ticketId', updateTicketById);
ticketRouter.delete('/:ticketId', deleteTicketController);

ticketRouter.get('/places/:placeId', findAllTicketPlaces);

ticketRouter.get('/status/:statusId', findAllStatus);

ticketRouter.get('/buildings/:buildingsNanoId', findManyTicketsController);

ticketRouter.get('/report/pdf', listTicketsByCompanyId);
ticketRouter.post('/report/pdf', generateTicketReportPDF);

ticketRouter.get('/extras/auxiliary-data', findTicketsAuxiliaryDataController);
ticketRouter.get(
  '/extras/occasional-maintenances/:buildingNanoId',
  findOccasionalMaintenancesForTicketsController,
);

ticketRouter.post('/connect-to-maintenance', connectTicketsToExistingMaintenancesController);
