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
import { createBuildingBanner } from '../company/buildings/buildingBanners/controllers/createBuildingBanner';
import { findSyndicsByBuildingNanoId } from './building/controllers/findSyndicsByBuildingNanoId';
import { sharedCreateReportProgress } from '../shared/maintenancesReportProgresses/controllers/sharedCreateReportProgress';
import { sharedFindReportProgress } from '../shared/maintenancesReportProgresses/controllers/sharedFindReportProgress';
import { checklistRouter } from './checklists/checklist.routes';
import { listTimeIntervals } from '../shared/timeInterval/controllers/listTimeIntervals';
import { ticketRouter } from './tickets/ticket.routes';
import { checkPasswordExistenceController } from './building/controllers/checkPasswordExistenceController';
import { validatePasswordController } from './building/controllers/validatePasswordController';
import { supplierRouter } from './suppliers/supplier.routes';
import { maintenanceHistoryActivitiesRouter } from '../shared/maintenanceHistoryActivities/maintenanceHistoryActivities.routes';
import { findManyBuildingsBySyndicNanoId } from './building/controllers/findManyBuildingsBySyndicNanoId';
import { deleteBuildingBanner } from '../company/buildings/buildingBanners/controllers/deleteBuildingBanner';
import { updateBuildingBanner } from '../company/buildings/buildingBanners/controllers/updateBuildingBanner';
import { sharedListCategoriesByNanoId } from '../shared/categories/controllers/sharedListCategoriesByNanoId';
import { serviceTypesRouter } from './serviceTypes/serviceTypes.routes';
import { ticketHistoryActivitiesRouter } from './ticketHistoryActivities/ticketHistoryActivities.routes';
import { ticketDismissReasonsRouter } from './ticketDismissReasons/ticketDismissReasons.routes';
import { findAllMaintenancePriority } from '../shared/maintenancePriority/controllers/findAllMaintenancePriority';
import { listBuildingApartmentsController } from './building/controllers/listBuildingApartmentsController';
import { listForSelectRouter } from './listForSelect/list.routes';
import { getMaintenancesKanban } from './building/controllers/getMaintenancesKanban';
import { userRouter } from './user/user.routes';
import { findBuildingByIdController } from './building/controllers/findBuildingByIdController';

// ROUTES
export const clientRouter: Router = Router();

clientRouter.use('/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

clientRouter.use('/upload', uploadRouter);

clientRouter.get('/syndic/:syndicNanoId', clientSyndicBuildingDetails);

clientRouter.get('/building/id/:buildingId', findBuildingByIdController);

clientRouter.get('/building/:buildingId', clientBuildingDetails);

clientRouter.post('/building/reports/occasional/create', createOccasionalReport);

clientRouter.get('/building/informations/:buildingId', findClientInformations);

clientRouter.get('/building/home/:buildingId', findHomeInformations);

clientRouter.get('/building/annex/:buildingId', findBuildingAnnex);

clientRouter.get('/building/logo/:buildingId', findCompanyLogo);

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

// ANTES AQUI LISTAVA AS AVULSAS JUNTOS - REMOVIDO NA TASK SA-7137
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

clientRouter.post('/buildings/banners/create', createBuildingBanner);
clientRouter.put('/buildings/banners/update', updateBuildingBanner);
clientRouter.delete('/buildings/banners/delete/:bannerId', deleteBuildingBanner);

clientRouter.get('/syndics/:buildingNanoId', findSyndicsByBuildingNanoId);

clientRouter.get('/timeinterval/list', listTimeIntervals);

clientRouter.use('/checklists', checklistRouter);

clientRouter.use('/tickets', ticketRouter);

clientRouter.use('/suppliers', supplierRouter);

clientRouter.get('/check-password-existence/:buildingId/:type', checkPasswordExistenceController);

clientRouter.post('/validate-password', validatePasswordController);

clientRouter.use('/maintenance-history-activities', maintenanceHistoryActivitiesRouter);

clientRouter.get(
  '/find-buildings-by-syndic-nano-id/:syndicNanoId',
  findManyBuildingsBySyndicNanoId,
);

clientRouter.get('/categories/listByNanoId/:nanoId', sharedListCategoriesByNanoId);

clientRouter.use('/serviceTypes', serviceTypesRouter);

clientRouter.use('/ticketHistoryActivities', ticketHistoryActivitiesRouter);

clientRouter.use('/ticketDismissReasons', ticketDismissReasonsRouter);

clientRouter.get('/priority', findAllMaintenancePriority);

// # region user
clientRouter.use('/user', userRouter);

// MAINTENANCE KANBAN
clientRouter.get('/buildings/maintenances', getMaintenancesKanban);

// BUILDINGS APARTMENTS
clientRouter.get('/buildings/apartments/:buildingId', listBuildingApartmentsController);

// LIST
clientRouter.use('/list', listForSelectRouter);
