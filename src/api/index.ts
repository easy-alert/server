import swaggerUi from 'swagger-ui-express';

import { Router } from 'express';
import swaggerFile from '../docs/integrationToNewPlataformDocs.json';

import { backofficeRouter } from './backoffice/backoffice.routes';
import { companyRouter } from './company/company.routes';
import { clientRouter } from './client/client.routes';

import { findOldBuildingId } from './company/buildings/building/controllers';

// ROUTES
export const routes: Router = Router();

routes.use('/backoffice', backofficeRouter);
routes.use('/company', companyRouter);
routes.use('/client', clientRouter);

// URL FOR REDIRECT USER TO NEW CLIENT
routes.use('/integration/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

routes.use('/integration/buildings/old/find/:oldBuildingId', findOldBuildingId);
