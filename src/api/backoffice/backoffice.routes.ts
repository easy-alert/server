// LIBS
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../../docs/backofficeDocs.json';

// MIDDLEWARES
import { authMiddleware } from '../../middlewares/auth';
import { handleBackofficePermCheck } from '../../middlewares/permissions/permCheck';

// CHILDREN ROUTES
import { uploadRouter } from '../shared/upload/upload.routes';
import { authRouter } from './auth/auth.routes';
import { categoryRouter } from './categories/category/category.routes';
import { maintenanceRouter } from './categories/maintenance/maintenance.routes';
import { listTimeIntervals } from '../shared/timeInterval/controllers/listTimeIntervals';
import { findAllMaintenancePriority } from '../shared/maintenancePriority/controllers/findAllMaintenancePriority';
import { platformVideosRouter } from './platformVideos/platformVideos.routes';
import { permissionsRouter } from './permissions/permissions.routes';
import { buildingRouter } from './buildings/building.routes';
import { accountRouter } from './account/account.routes';
import { listForSelectRouter } from './listForSelect/list.routes';

// TYPES
import type { TPermissionsNames } from '../../types/TPermissionsNames';
import { dashboardRouter } from './dashboard/dashboard.routes';

// ROUTES
export const backofficeRouter: Router = Router();

// PERMISSIONS
const backofficePermissions = ['access:backoffice'] as TPermissionsNames[];

backofficeRouter.use(
  '/upload',
  authMiddleware,
  handleBackofficePermCheck(backofficePermissions),
  uploadRouter,
);

backofficeRouter.use('/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

backofficeRouter.use('/auth', authRouter);

backofficeRouter.use(
  '/categories',
  authMiddleware,
  handleBackofficePermCheck(backofficePermissions),
  categoryRouter,
);

backofficeRouter.use(
  '/maintenances',
  authMiddleware,
  handleBackofficePermCheck(backofficePermissions),
  maintenanceRouter,
);

backofficeRouter.use(
  '/account',
  authMiddleware,
  handleBackofficePermCheck(backofficePermissions),
  accountRouter,
);

backofficeRouter.get('/timeinterval/list', listTimeIntervals);

backofficeRouter.get('/maintenancePriority', findAllMaintenancePriority);

backofficeRouter.use(
  '/platform-videos',
  authMiddleware,
  handleBackofficePermCheck(backofficePermissions),
  platformVideosRouter,
);

backofficeRouter.use(
  '/permissions',
  authMiddleware,
  handleBackofficePermCheck(backofficePermissions),
  permissionsRouter,
);

backofficeRouter.use(
  '/buildings',
  authMiddleware,
  handleBackofficePermCheck(backofficePermissions),
  buildingRouter,
);

// DASHBOARD
backofficeRouter.use(
  '/dashboard',
  authMiddleware,
  handleBackofficePermCheck(backofficePermissions),
  dashboardRouter,
);

// LIST FOR SELECT
backofficeRouter.use(
  '/list',
  authMiddleware,
  handleBackofficePermCheck(backofficePermissions),
  listForSelectRouter,
);
