// LIBS
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerFile from './docs/swagger.json';

// MIDDLEWARES
import { authMiddleware } from '../../middlewares/auth';
import { uploadRouter } from '../shared/upload/upload.routes';

// CHIELD ROUTES
import { authRouter } from './auth/auth.routes';
import { isCompany } from '../../middlewares/permissions/isCompany';
import { accountRouter } from './account/account.routes';
import { categoryRouter } from './categories/category/category.routes';
import { listTimeIntervals } from '../shared/timeInterval/controllers/listTimeIntervals';
import { maintenanceRouter } from './categories/maintenance/maintenance.routes';

// ROUTES
export const companyRouter: Router = Router();

companyRouter.use('/auth', authRouter);
companyRouter.get('/timeinterval/list', listTimeIntervals);
companyRouter.use('/upload', authMiddleware, isCompany, uploadRouter);
companyRouter.use('/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

companyRouter.use('/account', authMiddleware, isCompany, accountRouter);
companyRouter.use('/categories', authMiddleware, isCompany, categoryRouter);
companyRouter.use(
  '/maintenances',
  authMiddleware,
  isCompany,
  maintenanceRouter,
);
