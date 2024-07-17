import { Router } from 'express';
import {
  createMaintenanceHistoryActivityController,
  findManyMaintenanceHistoryActivitysController,
} from '../../shared/maintenanceHistoryActivities/controllers';

export const maintenanceHistoryActivitiesRouter: Router = Router();

maintenanceHistoryActivitiesRouter.get(
  '/:maintenanceHistoryId',
  findManyMaintenanceHistoryActivitysController,
);

maintenanceHistoryActivitiesRouter.post('/', createMaintenanceHistoryActivityController);
