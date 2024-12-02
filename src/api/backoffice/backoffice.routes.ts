// LIBS
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../../docs/backofficeDocs.json';

// MIDDLEWARES
import { authMiddleware } from '../../middlewares/auth';
import { isBackoffice } from '../../middlewares/permissions/isBackoffice';
import { uploadRouter } from '../shared/upload/upload.routes';

// CHILDREN ROUTES
import { authRouter } from './auth/auth.routes';
import { categoryRouter } from './categories/category/category.routes';
import { maintenanceRouter } from './categories/maintenance/maintenance.routes';
import { companyRouter } from './users/accounts/company.routes';
import { listTimeIntervals } from '../shared/timeInterval/controllers/listTimeIntervals';
import { findAllMaintenancePriority } from '../shared/maintenancePriority/controllers/findAllMaintenancePriority';
import { tutorialsRoutes } from './tutorials/tutorials.routes';

// ROUTES
export const backofficeRouter: Router = Router();

backofficeRouter.use('/upload', authMiddleware, isBackoffice, uploadRouter);

backofficeRouter.use('/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

backofficeRouter.use('/auth', authRouter);

backofficeRouter.use('/categories', authMiddleware, isBackoffice, categoryRouter);
backofficeRouter.use('/maintenances', authMiddleware, isBackoffice, maintenanceRouter);
backofficeRouter.use('/companies', authMiddleware, isBackoffice, companyRouter);

backofficeRouter.get('/timeinterval/list', listTimeIntervals);

backofficeRouter.get('/maintenancePriority', findAllMaintenancePriority);

backofficeRouter.use('/tutorials', authMiddleware, isBackoffice, tutorialsRoutes);
