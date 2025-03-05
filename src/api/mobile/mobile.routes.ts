// LIBS
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../../docs/externalDocs.json';
import { listBuildingsFromResponsible } from './auth/controllers/listBuildingsFromResponsible';
import { getMaintenancesKanban } from './maintenances/controllers/getMaintenancesKanban';

// ROUTES
export const mobileRoutes: Router = Router();

mobileRoutes.use('/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

mobileRoutes.post('/auth', listBuildingsFromResponsible);

mobileRoutes.get('/buildings/maintenances/kanban', getMaintenancesKanban);
