// LIBS
import { Router } from 'express';

// FUNCTIONS
import { createMaintenance } from './controllers/createMaintenance';
import { createMaintenanceHistory } from './controllers/createMaintenanceHistory';

export const maintenanceRouter = Router();

maintenanceRouter.post('/create', createMaintenance);
maintenanceRouter.post('/edit', createMaintenanceHistory);
