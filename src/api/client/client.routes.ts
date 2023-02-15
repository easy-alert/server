// LIBS
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerFile from '../../docs/clientDocs.json';

import { uploadRouter } from '../shared/upload/upload.routes';
import { clientBuildingDetails } from './building/controllers/clientBuildingDetails';
import { clientSyndicBuildingDetails } from './building/controllers/clientSyndicBuildingDetails';
import { findClientInformations } from './building/controllers/findClientInformations';

// ROUTES
export const clientRouter: Router = Router();

clientRouter.use('/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

clientRouter.use('/upload', uploadRouter);

clientRouter.get('/building/:buildingId', clientBuildingDetails);
clientRouter.get('/syndic/:syndicId', clientSyndicBuildingDetails);

clientRouter.get('/building/informations/:buildingId', findClientInformations);
