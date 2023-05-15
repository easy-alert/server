// LIBS
import { Router } from 'express';
import {
  sharedCreateMaintenanceReport,
  sharedMaintenanceHistoryDetails,
} from '../../../shared/maintenancesReports/controllers';

// FUNCTIONS
import { createMaintenance } from './controllers/createMaintenance';
import { deleteMaintenance } from './controllers/deleteMaintenance';
import { editMaintenance } from './controllers/editMaintenance';
import { sharedEditMaintenanceReport } from '../../../shared/maintenancesReports/controllers/sharedEditMaintenanceReport';

export const maintenanceRouter = Router();

maintenanceRouter.post('/create', createMaintenance);
maintenanceRouter.put('/edit', editMaintenance);
maintenanceRouter.delete('/delete', deleteMaintenance);
maintenanceRouter.post('/create/report', sharedCreateMaintenanceReport);
maintenanceRouter.post('/edit/report', sharedEditMaintenanceReport);
maintenanceRouter.get('/list/details/:maintenanceHistoryId', sharedMaintenanceHistoryDetails);
