// LIBS
import { Router } from 'express';

// CONTROLLERS
import { listBuildingsForSelectController } from './controllers/listBuildingsForSelectController';
import { listUsersForSelectController } from './controllers/listUsersForSelectController';
import { listMaintenanceStatusForSelectController } from './controllers/listMaintenanceStatusForSelectController';
import { listMaintenanceCategoriesForSelectController } from './controllers/listMaintenanceCategoriesForSelectController';
import { listGuaranteeSystemsForSelectController } from './controllers/listGuaranteeSystemsForSelectController';
import { listGuaranteeFailureTypesForSelectController } from './controllers/listGuaranteeFailureTypesForSelectController';

// ROUTES
export const listForSelectRouter = Router();

// BUILDINGS
listForSelectRouter.get('/buildings', listBuildingsForSelectController);

// USERS
listForSelectRouter.get('/users', listUsersForSelectController);

// MAINTENANCES
listForSelectRouter.get('/maintenances/status', listMaintenanceStatusForSelectController);
listForSelectRouter.get('/maintenances/categories', listMaintenanceCategoriesForSelectController);

// GUARANTEE
listForSelectRouter.get('/guarantee/systems', listGuaranteeSystemsForSelectController);
listForSelectRouter.get('/guarantee/failure-types', listGuaranteeFailureTypesForSelectController);
