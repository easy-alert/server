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
  listBuildingDetailsMaintenances,
} from './building/controllers';

import {
  createBuildingNotificationConfiguration,
  deleteBuildingNotificationConfiguration,
  editBuildingNotificationConfiguration,
  sendWhatsappConfirmationBuildingNotificationConfiguration,
} from './notificationConfiguration/controllers';

import {
  // createBuildingCategoriesAndMaintenaces,
  editBuildingCategoriesAndMaintenaces,
  listBuildingCategoriesAndMaintenances,
} from './buildingMaintenances/controllers';

// ROUTES
export const buildingRouter = Router();

// BUILDING
buildingRouter.post('/create', createBuilding);
buildingRouter.put('/edit', editBuilding);
buildingRouter.get('/list', listBuilding);
buildingRouter.get('/list/details/:buildingId', listBuildingDetails);
buildingRouter.delete('/delete', deleteBuilding);
buildingRouter.get('/list/details/:buildingId/maintenances', listBuildingDetailsMaintenances);

// BUILDING TYPES
buildingRouter.get('/types/list', listBuildingTypes);

// NOTIFICATIONS
buildingRouter.post(
  '/notifications/sendconfirm/phone',
  sendWhatsappConfirmationBuildingNotificationConfiguration,
);

buildingRouter.post('/notifications/create', createBuildingNotificationConfiguration);

buildingRouter.put('/notifications/edit', editBuildingNotificationConfiguration);
buildingRouter.delete('/notifications/delete', deleteBuildingNotificationConfiguration);

// BUILDING MAINTENANCES
// buildingRouter.post('/maintenances/create', createBuildingCategoriesAndMaintenaces);
buildingRouter.put('/maintenances/edit', editBuildingCategoriesAndMaintenaces);
buildingRouter.get('/maintenances/list', listBuildingCategoriesAndMaintenances);
