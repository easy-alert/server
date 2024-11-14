import { Router } from 'express';

import { findManyTicketDismissReasons } from '../../shared/ticketDismissReasons/controllers/findManyTicketDismissReasons';

export const ticketDismissReasonsRouter: Router = Router();

ticketDismissReasonsRouter.get('/', findManyTicketDismissReasons);
