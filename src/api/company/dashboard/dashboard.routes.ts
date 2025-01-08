// LIBS
import { Router } from 'express';

import {
  dashboardFiltersController,
  maintenancesByStatusController,
  maintenancesCountAndCostController,
  maintenancesMostCompletedExpiredController,
  maintenancesTimelineController,
  ticketsByServiceTypeController,
  ticketsCountAndCostController,
} from './controllers';

// ROUTES
export const dashboardRouter = Router();

dashboardRouter.get('/filters', dashboardFiltersController);

dashboardRouter.get('/maintenances/count-and-cost', maintenancesCountAndCostController);
dashboardRouter.get('/maintenances/status', maintenancesByStatusController);
dashboardRouter.get('/maintenances/timeline', maintenancesTimelineController);
dashboardRouter.get(
  '/maintenances/most-completed-expired',
  maintenancesMostCompletedExpiredController,
);

dashboardRouter.get('/tickets/count-and-cost', ticketsCountAndCostController);
dashboardRouter.get('/tickets/service-types', ticketsByServiceTypeController);
