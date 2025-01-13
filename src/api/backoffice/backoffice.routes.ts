// LIBS
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../../docs/backofficeDocs.json';

// MIDDLEWARES
import { authMiddleware } from '../../middlewares/auth';
import { uploadRouter } from '../shared/upload/upload.routes';
import { permCheck } from '../../middlewares/permissions/permCheck';

// CHILDREN ROUTES
import { authRouter } from './auth/auth.routes';
import { categoryRouter } from './categories/category/category.routes';
import { maintenanceRouter } from './categories/maintenance/maintenance.routes';
import { companyRouter } from './users/accounts/company.routes';
import { listTimeIntervals } from '../shared/timeInterval/controllers/listTimeIntervals';
import { findAllMaintenancePriority } from '../shared/maintenancePriority/controllers/findAllMaintenancePriority';
import { tutorialsRouter } from './tutorials/tutorials.routes';

// TYPES
import type { TPermissionsNames } from '../../types/TPermissionsNames';

// PERMISSIONS
const backofficePermissions = ['admin:backoffice', 'access:backoffice'] as TPermissionsNames[];

// ROUTES
export const backofficeRouter: Router = Router();

backofficeRouter.use('/upload', authMiddleware, permCheck(backofficePermissions), uploadRouter);

backofficeRouter.use('/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

backofficeRouter.use('/auth', authRouter);

backofficeRouter.use(
  '/categories',
  authMiddleware,
  permCheck(backofficePermissions),
  categoryRouter,
);
backofficeRouter.use(
  '/maintenances',
  authMiddleware,
  permCheck(backofficePermissions),
  maintenanceRouter,
);
backofficeRouter.use('/companies', authMiddleware, permCheck(backofficePermissions), companyRouter);

backofficeRouter.get('/timeinterval/list', listTimeIntervals);

backofficeRouter.get('/maintenancePriority', findAllMaintenancePriority);

backofficeRouter.use(
  '/tutorials',
  authMiddleware,
  permCheck(backofficePermissions),
  tutorialsRouter,
);
