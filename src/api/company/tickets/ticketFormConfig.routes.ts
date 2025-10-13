import { Router } from 'express';
import { TicketFormController } from '../../shared/tickets/controllers/ticketFormController';

const ticketFormConfigRoute = Router();

const ticketFormController = new TicketFormController();

ticketFormConfigRoute.get('/', (req, res) => ticketFormController.get(req, res));
ticketFormConfigRoute.put('/', (req, res) => ticketFormController.upsert(req, res));

export { ticketFormConfigRoute };
