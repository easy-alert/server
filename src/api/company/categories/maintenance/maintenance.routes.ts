// LIBS
import { Router } from 'express';

// FUNCTIONS
import { createMaintenance } from './controllers/createMaintenance';
import { deleteMaintenance } from './controllers/deleteMaintenance';
import { editMaintenance } from './controllers/editMaintenance';

export const maintenanceRouter = Router();

maintenanceRouter.post('/create', createMaintenance);
maintenanceRouter.put('/edit', editMaintenance);
maintenanceRouter.delete('/delete', deleteMaintenance);
