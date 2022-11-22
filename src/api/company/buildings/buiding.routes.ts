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
  editBuildingCategoriesAndMaintenaces,
  listBuildingCategoriesAndMaintenances,
} from './buildingMaintenances/controllers';
import { listBuildingForSelect } from './building/controllers/listBuildingsForSelect';
import { sendEmailConfirmationBuildingNotificationConfiguration } from './notificationConfiguration/controllers/sendEmailConfirmationBuildingNotificationConfiguration';

// ROUTES
export const buildingRouter = Router();

// BUILDING
buildingRouter.post('/create', createBuilding);
buildingRouter.put('/edit', editBuilding);
buildingRouter.get('/list', listBuilding);
buildingRouter.get('/listforselect/:buildingId', listBuildingForSelect);

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

buildingRouter.post(
  '/notifications/sendconfirm/email',
  sendEmailConfirmationBuildingNotificationConfiguration,
);

buildingRouter.post('/notifications/create', createBuildingNotificationConfiguration);

buildingRouter.put('/notifications/edit', editBuildingNotificationConfiguration);
buildingRouter.delete('/notifications/delete', deleteBuildingNotificationConfiguration);

// BUILDING MAINTENANCES
buildingRouter.put('/maintenances/edit', editBuildingCategoriesAndMaintenaces);
buildingRouter.post('/maintenances/list', listBuildingCategoriesAndMaintenances);
