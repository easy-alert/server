// LIBS
import { Router } from 'express';
// VALIDATORS
import { isBackoffice } from '../../../../middlewares/permissions/isBackoffice';

// FUNCTIONS
import { createMaintenance } from './controllers/createMaintenance';
import { createMaintenanceHistory } from './controllers/createMaintenanceHistory';
import { deleteMaintenance } from './controllers/deleteMaintenance';

export const backofficeMaintenanceRouter = Router();

backofficeMaintenanceRouter.post('/create', isBackoffice, createMaintenance);
backofficeMaintenanceRouter.post(
  '/edit',
  isBackoffice,
  createMaintenanceHistory,
);
backofficeMaintenanceRouter.delete('/delete', isBackoffice, deleteMaintenance);
