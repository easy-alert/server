// LIBS
import { Router } from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../../docs/externalDocs.json';

import { getMaintenancesKanban } from './maintenances/controllers/getMaintenancesKanban';

import { authRouter } from './auth/auth.routes';
import { buildingsRoutes } from './buildings/buildings.routes';

// ROUTES
export const mobileRoutes: Router = Router();

mobileRoutes.use('/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

// auth routes
mobileRoutes.use('/auth', authRouter);

// building routes
mobileRoutes.use('/buildings', buildingsRoutes);

mobileRoutes.get('/buildings/maintenances/kanban', getMaintenancesKanban);

