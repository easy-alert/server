// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listAuxiliaryData, listData } from './controllers';

import { maintenancesCountAndCostController } from './controllers/MaintenancesCountAndCostController';
import { maintenancesByStatusController } from './controllers/maintenancesByStatusController';
import { maintenancesTimelineController } from './controllers/maintenancesTimelineController';

import { ticketsCountAndCostController } from './controllers/TicketsCountAndCostController';
import { ticketsByServiceTypeController } from './controllers/ticketsByServiceTypeController';

// ROUTES
export const dashboardRouter = Router();

dashboardRouter.get('/list-data', listData);
dashboardRouter.get('/list-auxiliary-data', listAuxiliaryData);

dashboardRouter.get('/maintenances/count-and-cost', maintenancesCountAndCostController);
dashboardRouter.get('/maintenances/status', maintenancesByStatusController);
dashboardRouter.get('/maintenances/timeline', maintenancesTimelineController);

dashboardRouter.get('/tickets/count-and-cost', ticketsCountAndCostController);
dashboardRouter.get('/tickets/service-types', ticketsByServiceTypeController);
