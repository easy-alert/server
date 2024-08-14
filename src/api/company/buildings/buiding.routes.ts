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
  changeShowContactStatus,
} from './notificationConfiguration/controllers';

import {
  editBuildingCategoriesAndMaintenances,
  listBuildingCategoriesAndMaintenances,
} from './buildingMaintenances/controllers';

import { listBuildingForSelect } from './building/controllers/listBuildingsForSelect';
import { sendEmailConfirmationBuildingNotificationConfiguration } from './notificationConfiguration/controllers/sendEmailConfirmationBuildingNotificationConfiguration';
import { buildingAnnexeRouter } from './annexes/annexe.routes';
import { buildingChangeBanner } from './buildingBanners/controllers/buildingChangeBanner';
import { listForBuildingReports } from './reports/controllers/listForBuildingReports';
import { listForSelectBuildingReports } from './reports/controllers/listForSelectBuildingReports';
import { listBuildingsAndTemplatesForSelect } from './building/controllers/listBuildingsAndTemplatesForSelect';

import { listAuxiliaryDataForOccasionalCategoriesAndMaintenances } from './occasionalBuildingMaintenances/controllers/listAuxiliaryDataForOccasionalCategoriesAndMaintenances';
import { createOccasionalReport } from './reports/controllers/createOcassionalReport';
import { foldersRouter } from './folders/folders.routes';
import { findDataForAutocompleteInCreate } from './notificationConfiguration/controllers/findDataForAutocompleteInCreate';
import { listSyndicsForSelect } from './notificationConfiguration/controllers/listSyndicsForSelect';
import { updateClientPasswordController } from './building/controllers/updateClientPasswordController';
import { generateMaintenanceReportPDF } from './reports/controllers/generateMaintenanceReportPDF';
import { listReportPdfs } from './reports/controllers/listReportPdfs';

// ROUTES
export const buildingRouter = Router();

// BUILDING
buildingRouter.post('/create', createBuilding);
buildingRouter.put('/edit', editBuilding);
buildingRouter.get('/list', listBuilding);
buildingRouter.get('/listforselect', listBuildingForSelect);
buildingRouter.get('/listforselectwithtemplates/:buildingId', listBuildingsAndTemplatesForSelect);

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

buildingRouter.put('/notifications/change/showcontact', changeShowContactStatus);

buildingRouter.post(
  '/notifications/sendconfirm/email',
  sendEmailConfirmationBuildingNotificationConfiguration,
);

buildingRouter.get(
  '/notifications/list-for-autocomplete/:buildingId',
  findDataForAutocompleteInCreate,
);
buildingRouter.get('/notifications/list-for-select/:buildingNanoId', listSyndicsForSelect);
buildingRouter.post('/notifications/create', createBuildingNotificationConfiguration);
buildingRouter.put('/notifications/edit', editBuildingNotificationConfiguration);
buildingRouter.delete('/notifications/delete', deleteBuildingNotificationConfiguration);

// BUILDING MAINTENANCES
buildingRouter.put('/maintenances/edit', editBuildingCategoriesAndMaintenances);
buildingRouter.post('/maintenances/list', listBuildingCategoriesAndMaintenances);

// BUILDING ANNEXES
buildingRouter.use('/annexes', buildingAnnexeRouter);

// BUILDING BANNERS
buildingRouter.post('/banners/change', buildingChangeBanner);

// BUILDING REPORTS
buildingRouter.get('/reports/listforselect', listForSelectBuildingReports);

buildingRouter.get('/reports/list', listForBuildingReports);

buildingRouter.get('/reports/create/pdf', generateMaintenanceReportPDF);

buildingRouter.get('/reports/list/pdf', listReportPdfs);

// OCCAISIONAL REPORTS AND MAINTENANCES

buildingRouter.get('/reports/create', listForBuildingReports);

// ANTES AQUI LISTAVA AS AVULSAS JUNTOS - REMOVIDO NA TASK SA-7137
buildingRouter.get(
  '/maintenances/occasional/auxiliarydata',
  listAuxiliaryDataForOccasionalCategoriesAndMaintenances,
);
buildingRouter.post('/reports/occasional/create', createOccasionalReport);

// BUILDING FOLDERS
buildingRouter.use('/folders', foldersRouter);

//
buildingRouter.put('/client-passwords', updateClientPasswordController);
