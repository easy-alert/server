// LIBS
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../../docs/externalDocs.json';
import { countExpired } from './maintenances/controllers/countExpired';

// ROUTES
export const externalRouter: Router = Router();

externalRouter.use('/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

externalRouter.get('/maintenances/countexpired/:buildingId', countExpired);
