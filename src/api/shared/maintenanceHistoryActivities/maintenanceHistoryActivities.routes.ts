import { Router } from 'express';
import {
  createMaintenanceHistoryActivityController,
  findManyMaintenanceHistoryActivitiesController,
} from '../../shared/maintenanceHistoryActivities/controllers';

export const maintenanceHistoryActivitiesRouter: Router = Router();

maintenanceHistoryActivitiesRouter.get(
  '/:maintenanceHistoryId',
  findManyMaintenanceHistoryActivitiesController,
);

maintenanceHistoryActivitiesRouter.post('/', createMaintenanceHistoryActivityController);
