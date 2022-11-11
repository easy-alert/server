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

import {
  contactConfirmBuildingNotificationConfiguration,
  createBuildingNotificationConfiguration,
  deleteBuildingNotificationConfiguration,
  editBuildingNotificationConfiguration,
  sendWhatsappConfirmationBuildingNotificationConfiguration,
} from './notificationConfiguration/controllers';

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
  '/notifications/sendconfirm/phone',
  sendWhatsappConfirmationBuildingNotificationConfiguration,
);

buildingRouter.post(
  '/notifications/contactconfirm',
  contactConfirmBuildingNotificationConfiguration,
);

buildingRouter.post('/notifications/create', createBuildingNotificationConfiguration);

buildingRouter.put('/notifications/edit', editBuildingNotificationConfiguration);
buildingRouter.delete('/notifications/delete', deleteBuildingNotificationConfiguration);
