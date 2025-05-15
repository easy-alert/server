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

// version route
mobileRoutes.get('/version', (_req, res) => {
  res.status(200).json({
    ios: process.env.IOS_VERSION || '1.0.0',
    android: Number(process.env.ANDROID_VERSION) || 1,
  });
});
