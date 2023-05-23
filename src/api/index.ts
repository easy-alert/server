import swaggerUi from 'swagger-ui-express';

import { Router } from 'express';
import integrationSwaggerFile from '../docs/integrationToNewPlataformDocs.json';
import scriptSwaggerFile from '../docs/scriptDocs.json';

import { backofficeRouter } from './backoffice/backoffice.routes';
import { companyRouter } from './company/company.routes';
import { clientRouter } from './client/client.routes';
import { externalRouter } from './external/external.routes';

import { findOldBuildingId } from './company/buildings/building/controllers';
import { scriptRouter } from '../utils/scripts/scripts.routes';

// ROUTES
export const routes: Router = Router();

routes.use('/backoffice', backofficeRouter);
routes.use('/company', companyRouter);
routes.use('/client', clientRouter);
routes.use('/external', externalRouter);
routes.use('/scripts', scriptRouter);

// URL FOR REDIRECT USER TO NEW CLIENT
routes.use('/integration/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(integrationSwaggerFile);
  res.send(html);
});

// SCRIPTS URLS
routes.use('/scripts/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(scriptSwaggerFile);
  res.send(html);
});

routes.use('/integration/buildings/old/find/:oldBuildingId', findOldBuildingId);
