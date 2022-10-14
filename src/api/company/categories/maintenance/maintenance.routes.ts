// LIBS
import { Router } from 'express';

// FUNCTIONS
import { createMaintenance } from '../../../shared/categories/maintenace/controllers/createMaintenance';
import { editMaintenance } from '../../../shared/categories/maintenace/controllers/editMaintenance';

export const maintenanceRouter = Router();

maintenanceRouter.post('/create', createMaintenance);
maintenanceRouter.put('/edit', editMaintenance);
