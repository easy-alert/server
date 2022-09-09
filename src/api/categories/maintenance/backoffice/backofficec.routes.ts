// LIBS
import { Router } from 'express';
// VALIDATORS
import { isBackoffice } from '../../../../middlewares/permissions/isBackoffice';

// FUNCTIONS
import { createMaintenance } from './controllers/createMaintenance';
import { createMaintenanceHistory } from './controllers/createMaintenanceHistory';

export const backofficeMaintenanceRouter = Router();

backofficeMaintenanceRouter.post('/create', isBackoffice, createMaintenance);
backofficeMaintenanceRouter.post(
  '/edit',
  isBackoffice,
  createMaintenanceHistory,
);
