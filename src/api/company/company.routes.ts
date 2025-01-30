// LIBS
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerFile from '../../docs/companyDocs.json';

// MIDDLEWARES
import { authMiddleware } from '../../middlewares/auth';
import { uploadRouter } from '../shared/upload/upload.routes';
import { handleCompanyPermCheck } from '../../middlewares/permissions/permCheck';

// CHILD ROUTES
import { authRouter } from './auth/auth.routes';
import { accountRouter } from './account/account.routes';
import { categoryRouter } from './categories/category/category.routes';
import { listTimeIntervals } from '../shared/timeInterval/controllers/listTimeIntervals';
import { maintenanceRouter } from './categories/maintenance/maintenance.routes';

import { contactConfirmBuildingNotificationConfiguration } from './buildings/notificationConfiguration/controllers';
import { buildingRouter } from './buildings/buiding.routes';
import { listBuildingDetailsForConfirm } from './buildings/building/controllers/listBuildingDetailsForConfirm';
import { calendarRouter } from './calendar/calendar.routes';
import { sendEmailForRecoveryPassword } from '../shared/recoveryPassword/controllers/sendEmailForRecoveryPassord';
import { changePassword } from '../shared/recoveryPassword/controllers/changePassword';
import { companyUserRouter } from './companyUser/companyUser.routes';
import { dashboardRouter } from './dashboard/dashboard.routes';
import { checklistRouter } from './checklists/checklist.routes';
import { ticketRouter } from './tickets/ticket.routes';
import { supplierRouter } from './suppliers/supplier.routes';
import { maintenanceHistoryActivitiesRouter } from '../shared/maintenanceHistoryActivities/maintenanceHistoryActivities.routes';
import { ticketHistoryActivitiesRouter } from './ticketHistoryActivities/ticketHistoryActivities.routes';
import { ticketDismissReasonsRouter } from './ticketDismissReasons/ticketDismissReasons.routes';
import { findManyServiceTypes } from '../shared/serviceTypes/controllers/findManyServiceTypes';
import { findAllMaintenancePriority } from '../shared/maintenancePriority/controllers/findAllMaintenancePriority';
import { tutorialsRouter } from './tutorials/tutorials.routes';
import { usersRouter } from './users/users.routes';
import { permissionsRouter } from './permissions/permissions.routes';
import { listForSelectRouter } from './listForSelect/list.routes';

// ROUTES
export const companyRouter: Router = Router();

companyRouter.use('/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

companyRouter.post(
  '/buildings/notifications/contactconfirm',
  contactConfirmBuildingNotificationConfiguration,
);

companyRouter.post('/buildings/list/detailsforconfirm', listBuildingDetailsForConfirm);

companyRouter.use('/auth', authRouter);

// Middlewares estão lá dentro
companyRouter.use('/usercompany', companyUserRouter);

companyRouter.get('/timeinterval/list', listTimeIntervals);

companyRouter.use('/upload', uploadRouter);

companyRouter.use(
  '/account',
  authMiddleware,
  handleCompanyPermCheck(['access:account']),
  accountRouter,
);

companyRouter.use(
  '/users',
  authMiddleware,
  handleCompanyPermCheck(['access:company']),
  usersRouter,
);

companyRouter.use(
  '/categories',
  authMiddleware,
  handleCompanyPermCheck(['access:company']),
  categoryRouter,
);

companyRouter.use(
  '/buildings',
  authMiddleware,
  handleCompanyPermCheck(['access:buildings']),
  buildingRouter,
);

companyRouter.use(
  '/maintenances',
  authMiddleware,
  handleCompanyPermCheck(['access:company']),
  maintenanceRouter,
);

companyRouter.use(
  '/calendars',
  authMiddleware,
  handleCompanyPermCheck(['access:calendar']),
  calendarRouter,
);

companyRouter.post('/passwordrecovery/sendemail', sendEmailForRecoveryPassword);

companyRouter.put('/passwordrecovery/change', changePassword);

companyRouter.use(
  '/dashboard',
  authMiddleware,
  handleCompanyPermCheck(['access:dashboard']),
  dashboardRouter,
);

companyRouter.use(
  '/checklists',
  authMiddleware,
  handleCompanyPermCheck(['access:checklist']),
  checklistRouter,
);

companyRouter.use(
  '/tickets',
  authMiddleware,
  handleCompanyPermCheck(['access:tickets']),
  ticketRouter,
);

companyRouter.use(
  '/suppliers',
  authMiddleware,
  handleCompanyPermCheck(['access:suppliers']),
  supplierRouter,
);

companyRouter.use(
  '/maintenance-history-activities',
  authMiddleware,
  handleCompanyPermCheck(['access:company']),
  maintenanceHistoryActivitiesRouter,
);

companyRouter.use(
  '/ticketHistoryActivities',
  authMiddleware,
  handleCompanyPermCheck(['access:company']),
  ticketHistoryActivitiesRouter,
);

companyRouter.use(
  '/ticketDismissReasons',
  authMiddleware,
  handleCompanyPermCheck(['access:company']),
  ticketDismissReasonsRouter,
);

companyRouter.get(
  '/serviceTypes',
  authMiddleware,
  handleCompanyPermCheck(['access:company']),
  findManyServiceTypes,
);

companyRouter.get(
  '/priority',
  authMiddleware,
  handleCompanyPermCheck(['access:company']),
  findAllMaintenancePriority,
);

companyRouter.use(
  '/tutorials',
  authMiddleware,
  handleCompanyPermCheck(['access:tutorials']),
  tutorialsRouter,
);

companyRouter.use(
  '/permissions',
  authMiddleware,
  handleCompanyPermCheck(['access:company']),
  permissionsRouter,
);

companyRouter.use(
  '/list',
  authMiddleware,
  handleCompanyPermCheck(['access:company']),
  listForSelectRouter,
);
