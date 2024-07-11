import { Router } from 'express';
import { createDefaultTemplates } from './createDefaultTemplates';
import { createBuildingFolders } from './createBuildingFolders';
import { deleteAllExpiredMaintenancesFromBuilding } from './deleteAllExpiredMaintenancesFromBuilding';
import { deleteExpiredMaintenance } from './deleteExpiredMaintenance';
import { migrateBuildingToOtherCompany } from './migrateBuildingToOtherCompany';

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
