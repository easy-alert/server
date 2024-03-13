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
import { findSyndicsByBuildingNanoId } from './building/controllers/findSyndicsByBuildingNanoId';
import { sharedCreateReportProgress } from '../shared/maintenancesReportProgresses/controllers/sharedCreateReportProgress';
import { sharedFindReportProgress } from '../shared/maintenancesReportProgresses/controllers/sharedFindReportProgress';
import { findLocalSuppliers } from './building/controllers/findLocalSuppliers';
import { checklistRouter } from './checklists/checklist.routes';
import { listTimeIntervals } from '../shared/timeInterval/controllers/listTimeIntervals';

// ROUTES
export const clientRouter: Router = Router();

clientRouter.use('/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

clientRouter.use('/upload', uploadRouter);

clientRouter.get('/syndic/:syndicNanoId', clientSyndicBuildingDetails);

clientRouter.get('/building/:buildingNanoId', clientBuildingDetails);

clientRouter.post('/building/reports/occasional/create', createOccasionalReport);

clientRouter.get('/building/informations/:buildingNanoId', findClientInformations);

clientRouter.get('/building/home/:buildingNanoId', findHomeInformations);

clientRouter.get('/building/annex/:buildingNanoId', findBuildingAnnex);

clientRouter.get('/building/logo/:buildingNanoId', findCompanyLogo);

clientRouter.get('/building/suppliers/:buildingNanoId', findLocalSuppliers);

clientRouter.post('/maintenances/create/report', sharedCreateMaintenanceReport);

clientRouter.post('/maintenances/set/in-progress', sharedUpdateInProgressMaintenanceHistory);

clientRouter.post('/maintenances/create/report/progress', sharedCreateReportProgress);

clientRouter.get(
  '/maintenances/list/report/progress/:maintenanceHistoryId',
  sharedFindReportProgress,
);

clientRouter.get(
  '/maintenances/list/details/:maintenanceHistoryId',
  sharedMaintenanceHistoryDetails,
);

clientRouter.get('/templates/create', createDefaultTemplates);

clientRouter.get('/building/folders/list/:folderId', listFolderController);

clientRouter.post('/building/create-access-history', clientCreateBuildingAccessHistory);

// building com s
clientRouter.get('/buildings/settings-data/:buildingNanoId/:syndicNanoId', findSettingsData);

clientRouter.use('/buildings/folders', foldersRouter);

clientRouter.get(
  '/buildings/maintenances/occasional/auxiliarydata/:buildingNanoId',
  listAuxiliaryDataForOccasionalCategoriesAndMaintenances,
);

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

clientRouter.get('/syndics/:buildingNanoId', findSyndicsByBuildingNanoId);

clientRouter.use('/checklists', checklistRouter);

clientRouter.get('/timeinterval/list', listTimeIntervals);
