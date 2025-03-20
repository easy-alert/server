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
import { mobileRoutes } from './mobile/mobile.routes';
import { logCatcherMiddleware } from '../middlewares/logCatcherMiddleware';

// ROUTES
export const routes: Router = Router();

routes.use('/backoffice', logCatcherMiddleware, backofficeRouter);
routes.use('/company', logCatcherMiddleware, companyRouter);
routes.use('/client', logCatcherMiddleware, clientRouter);
routes.use('/external', logCatcherMiddleware, externalRouter);
routes.use('/scripts', logCatcherMiddleware, scriptRouter);
routes.use('/mobile', logCatcherMiddleware, mobileRoutes);

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
