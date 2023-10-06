// LIBS
import { Router } from 'express';
import {
  sharedCreateMaintenanceReport,
  sharedMaintenanceHistoryDetails,
  sharedEditMaintenanceReport,
  sharedListReportVersions,
} from '../../../shared/maintenancesReports/controllers';

// FUNCTIONS
import { createMaintenance } from './controllers/createMaintenance';
import { deleteMaintenance } from './controllers/deleteMaintenance';
import { editMaintenance } from './controllers/editMaintenance';
import { deleteOccasionalMaintenanceHistory } from './controllers/deleteOccasionalMaintenanceReport';
import { sharedUpdateInProgressMaintenanceHistory } from '../../../shared/maintenance/controllers/sharedUpdateInProgressMaintenanceHistory';

export const maintenanceRouter = Router();

maintenanceRouter.post('/create', createMaintenance);
maintenanceRouter.put('/edit', editMaintenance);

maintenanceRouter.delete('/delete', deleteMaintenance);

maintenanceRouter.delete(
  '/occasional/delete/:maintenanceHistoryId',
  deleteOccasionalMaintenanceHistory,
);

maintenanceRouter.post('/set/in-progress', sharedUpdateInProgressMaintenanceHistory);

maintenanceRouter.post('/create/report', sharedCreateMaintenanceReport);
maintenanceRouter.post('/edit/report', sharedEditMaintenanceReport);

maintenanceRouter.get('/list/report/versions/:maintenanceHistoryId', sharedListReportVersions);

maintenanceRouter.get('/list/details/:maintenanceHistoryId', sharedMaintenanceHistoryDetails);
