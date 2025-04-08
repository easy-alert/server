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
import { getMaintenancesKanban } from './controllers/getMaintenancesKanban';
import { sharedUpdateInProgressMaintenanceHistory } from '../../../shared/maintenance/controllers/sharedUpdateInProgressMaintenanceHistory';
import { sharedCreateReportProgress } from '../../../shared/maintenancesReportProgresses/controllers/sharedCreateReportProgress';
import { sharedFindReportProgress } from '../../../shared/maintenancesReportProgresses/controllers/sharedFindReportProgress';
import { editMaintenanceHistory } from './controllers/editMaintenanceHistory';

export const maintenanceRouter = Router();

// MAINTENANCE ROUTES
maintenanceRouter.get('/kanban', getMaintenancesKanban);

maintenanceRouter.post('/create', createMaintenance);
maintenanceRouter.put('/edit', editMaintenance);

maintenanceRouter.delete('/delete', deleteMaintenance);

maintenanceRouter.delete(
  '/occasional/delete/:maintenanceHistoryId',
  deleteOccasionalMaintenanceHistory,
);

// MAINTENANCE HISTORY ROUTES
maintenanceRouter.put('/history/edit', editMaintenanceHistory);

// MAINTENANCE REPORTS ROUTES
maintenanceRouter.post('/set/in-progress', sharedUpdateInProgressMaintenanceHistory);
maintenanceRouter.post('/create/report', sharedCreateMaintenanceReport);
maintenanceRouter.post('/create/report/progress', sharedCreateReportProgress);
maintenanceRouter.post('/edit/report', sharedEditMaintenanceReport);

maintenanceRouter.get('/list/report/versions/:maintenanceHistoryId', sharedListReportVersions);
maintenanceRouter.get('/list/report/progress/:maintenanceHistoryId', sharedFindReportProgress);
maintenanceRouter.get('/list/details/:maintenanceHistoryId', sharedMaintenanceHistoryDetails);
