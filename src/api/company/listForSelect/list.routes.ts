// LIBS
import { Router } from 'express';

// CONTROLLERS
import { listBuildingsForSelectController } from './controllers/listBuildingsForSelectController';
import { listUsersForSelectController } from './controllers/listUsersForSelectController';
import { listMaintenanceStatusForSelectController } from './controllers/listMaintenanceStatusForSelectController';
import { listMaintenanceCategoriesForSelectController } from './controllers/listMaintenanceCategoriesForSelectController';
import { listTicketPlacesForSelectController } from '../../shared/listForSelect/controllers.ts/listTicketPlacesForSelectController';
import { listTicketServiceTypesForSelectController } from '../../shared/listForSelect/controllers.ts/listTicketServiceTypesForSelectController';

// ROUTES
export const listForSelectRouter = Router();

// BUILDINGS
listForSelectRouter.get('/buildings', listBuildingsForSelectController);

// USERS
listForSelectRouter.get('/users', listUsersForSelectController);

// MAINTENANCES
listForSelectRouter.get('/maintenances/status', listMaintenanceStatusForSelectController);
listForSelectRouter.get('/maintenances/categories', listMaintenanceCategoriesForSelectController);

// TICKETS
listForSelectRouter.get('/tickets/places', listTicketPlacesForSelectController);
listForSelectRouter.get('/tickets/service-types', listTicketServiceTypesForSelectController);
