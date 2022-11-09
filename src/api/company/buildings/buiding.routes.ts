// LIBS
import { Router } from 'express';

// FUNCTIONS

import { listBuildingTypes } from './buildingsTypes/controllers/listBuilding';

import {
  createBuilding,
  deleteBuilding,
  editBuilding,
  listBuilding,
  listBuildingDetails,
} from './building/controllers';

import { createBuildingNotificationConfiguration } from './notificationConfiguration/controllers';

// ROUTES
export const buildingRouter = Router();

// BUILDING
buildingRouter.post('/create', createBuilding);
buildingRouter.put('/edit', editBuilding);
buildingRouter.get('/list', listBuilding);
buildingRouter.get('/list/details/:buildingId', listBuildingDetails);
buildingRouter.delete('/delete', deleteBuilding);

// BUILDING TYPES
buildingRouter.get('/types/list', listBuildingTypes);

// NOTIFICATIONS
buildingRouter.post(
  '/notification/create',
  createBuildingNotificationConfiguration,
);
