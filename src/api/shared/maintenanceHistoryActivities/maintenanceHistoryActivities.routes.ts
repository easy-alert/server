import { Router } from 'express';
import {
  createMaintenanceHistoryActivityController,
  findManyMaintenanceHistoryActivitiesController,
} from './controllers';

export const maintenanceHistoryActivitiesRouter: Router = Router();

maintenanceHistoryActivitiesRouter.get(
  '/:maintenanceHistoryId',
  findManyMaintenanceHistoryActivitiesController,
);

maintenanceHistoryActivitiesRouter.post('/', createMaintenanceHistoryActivityController);
