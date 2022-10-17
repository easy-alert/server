// LIBS
import { Router } from 'express';

// FUNCTIONS
import { editMaintenance } from '../../../shared/categories/maintenace/controllers/editMaintenance';
import { createMaintenance } from './controllers/createMaintenance';

export const maintenanceRouter = Router();

maintenanceRouter.post('/create', createMaintenance);
maintenanceRouter.put('/edit', editMaintenance);
