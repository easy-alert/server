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

clientRouter.get('/building/informations/:buildingNanoId', findClientInformations);

clientRouter.get('/building/home/:buildingNanoId', findHomeInformations);

clientRouter.get('/building/annex/:buildingNanoId', findBuildingAnnex);

clientRouter.get('/building/logo/:buildingNanoId', findCompanyLogo);

clientRouter.post('/maintenances/create/report', sharedCreateMaintenanceReport);

clientRouter.get('/templates/create', createDefaultTemplates);
