// LIBS
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerFile from '../../docs/clientDocs.json';
import {
  sharedCreateMaintenanceReport,
  sharedMaintenanceHistoryDetails,
} from '../shared/maintenancesReports/controllers';

import { uploadRouter } from '../shared/upload/upload.routes';
import { clientBuildingDetails } from './building/controllers/clientBuildingDetails';
import { clientSyndicBuildingDetails } from './building/controllers/clientSyndicBuildingDetails';
import { findClientInformations } from './building/controllers/findClientInformations';
import { findCompanyLogo } from './building/controllers/findCompanyLogo';
import { findBuildingAnnex } from './building/controllers/findBuildingAnnex';
import { findHomeInformations } from './building/controllers/findHomeInformations';
import { createDefaultTemplates } from '../../utils/scripts/createDefaultTemplates';
import { listAuxiliaryDataForOccasionalCategoriesAndMaintenances } from './occasionalBuildingMaintenances/controllers/listAuxiliaryDataForOccasionalCategoriesAndMaintenances';
import { createOccasionalReport } from './occasionalBuildingMaintenances/controllers/createOccasionalReport';
import { listFolderController } from './building/controllers/listFolder';
import { clientCreateBuildingAccessHistory } from './building/controllers/clientCreateBuildingAccessHistory';
import { sharedUpdateInProgressMaintenanceHistory } from '../shared/maintenance/controllers/sharedUpdateInProgressMaintenanceHistory';
import { foldersRouter } from '../company/buildings/folders/folders.routes';
import { findSettingsData } from './building/controllers/findSettingsData';
import {
  changeShowContactStatus,
  createBuildingNotificationConfiguration,
  deleteBuildingNotificationConfiguration,
  editBuildingNotificationConfiguration,
  sendWhatsappConfirmationBuildingNotificationConfiguration,
} from '../company/buildings/notificationConfiguration/controllers';
import { findDataForAutocompleteInCreate } from '../company/buildings/notificationConfiguration/controllers/findDataForAutocompleteInCreate';
import { sendEmailConfirmationBuildingNotificationConfiguration } from '../company/buildings/notificationConfiguration/controllers/sendEmailConfirmationBuildingNotificationConfiguration';
import { buildingChangeBanner } from '../company/buildings/buildingBanners/controllers/buildingChangeBanner';

// ROUTES
export const clientRouter: Router = Router();

clientRouter.use('/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

clientRouter.use('/upload', uploadRouter);

clientRouter.get('/syndic/:syndicNanoId', clientSyndicBuildingDetails);
clientRouter.get(
  '/maintenances/list/details/:maintenanceHistoryId',
  sharedMaintenanceHistoryDetails,
);

clientRouter.get('/building/:buildingNanoId', clientBuildingDetails);

clientRouter.get(
  '/buildings/maintenances/occasional/auxiliarydata/:buildingNanoId',
  listAuxiliaryDataForOccasionalCategoriesAndMaintenances,
);

clientRouter.post('/building/reports/occasional/create', createOccasionalReport);

clientRouter.get('/building/informations/:buildingNanoId', findClientInformations);

clientRouter.get('/building/home/:buildingNanoId', findHomeInformations);

clientRouter.get('/building/home/:buildingNanoId', findHomeInformations);

clientRouter.get('/building/annex/:buildingNanoId', findBuildingAnnex);

clientRouter.get('/building/logo/:buildingNanoId', findCompanyLogo);

clientRouter.post('/maintenances/create/report', sharedCreateMaintenanceReport);

clientRouter.post('/maintenances/set/in-progress', sharedUpdateInProgressMaintenanceHistory);

clientRouter.get('/templates/create', createDefaultTemplates);

clientRouter.get('/building/folders/list/:folderId', listFolderController);

clientRouter.post('/building/create-access-history', clientCreateBuildingAccessHistory);

// CRUDs
clientRouter.get('/buildings/settings-data/:buildingNanoId/:syndicNanoId', findSettingsData);

clientRouter.use('/buildings/folders', foldersRouter);

clientRouter.post(
  '/buildings/notifications/sendconfirm/phone',
  sendWhatsappConfirmationBuildingNotificationConfiguration,
);

clientRouter.put('/buildings/notifications/change/showcontact', changeShowContactStatus);

clientRouter.post(
  '/buildings/notifications/sendconfirm/email',
  sendEmailConfirmationBuildingNotificationConfiguration,
);

clientRouter.get(
  '/buildings/notifications/list-for-autocomplete/:buildingId',
  findDataForAutocompleteInCreate,
);
clientRouter.post('/buildings/notifications/create', createBuildingNotificationConfiguration);
clientRouter.put('/buildings/notifications/edit', editBuildingNotificationConfiguration);
clientRouter.delete('/buildings/notifications/delete', deleteBuildingNotificationConfiguration);

clientRouter.post('/buildings/banners/change', buildingChangeBanner);
