import { Router } from 'express';
import { createDefaultTemplates } from './createDefaultTemplates';
import { createBuildingFolders } from './createBuildingFolders';
import { deleteAllExpiredMaintenancesFromBuilding } from './deleteAllExpiredMaintenancesFromBuilding';
import { deleteExpiredMaintenance } from './deleteExpiredMaintenance';
import { migrateBuildingToOtherCompany } from './migrateBuildingToOtherCompany';
import { migrateReportObservationToActivities } from './migrateReportObservationToActivities';
import { migrateSuppliers } from './migrateSuppliers';
import { updateMaintenanceHistory } from './updateMaintenanceHistory';

// ROUTES
export const scriptRouter: Router = Router();

scriptRouter.get('/migrate-building', migrateBuildingToOtherCompany);

scriptRouter.post('/templates/create', createDefaultTemplates);
scriptRouter.get('/buildings/create-folders', createBuildingFolders);

scriptRouter.delete(
  '/expired-maintenances/all/:buildingId',
  deleteAllExpiredMaintenancesFromBuilding,
);

scriptRouter.delete('/expired-maintenances/:maintenanceHistoryId', deleteExpiredMaintenance);

scriptRouter.post('/expired-maintenances/update/:maintenanceHistoryId', updateMaintenanceHistory);

scriptRouter.get('/migrate-report-observation-to-activities', migrateReportObservationToActivities);

scriptRouter.post('/migrate-suppliers', migrateSuppliers);
