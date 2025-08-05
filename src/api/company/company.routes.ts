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
import { usersRouter } from './users/users.routes';
import { permissionsRouter } from './permissions/permissions.routes';
import { listForSelectRouter } from './listForSelect/list.routes';
import { updateReportPDFController } from './reports/controllers/updateReportPDFController';
import { homeRouter } from './home/home.routes';
import { calendarCalledRouter } from './calendarCalled/calendarCalled.routes';

// ROUTES
export const companyRouter: Router = Router();

const companyPermission = 'access:company';

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

companyRouter.use(
  '/account',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:account']),
  accountRouter,
);

companyRouter.use(
  '/users',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:company']),
  usersRouter,
);

companyRouter.use(
  '/categories',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:company']),
  categoryRouter,
);

companyRouter.use(
  '/buildings',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:buildings']),
  buildingRouter,
);

companyRouter.use(
  '/maintenances',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:company']),
  maintenanceRouter,
);

companyRouter.use(
  '/calendars',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:calendar-maintenances']),
  calendarRouter,
);

companyRouter.use(
  '/calendar-called',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:calendar-called']),
  calendarCalledRouter,
);
companyRouter.post('/passwordrecovery/sendemail', sendEmailForRecoveryPassword);

companyRouter.put('/passwordrecovery/change', changePassword);

companyRouter.use(
  '/dashboard',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:dashboard']),
  dashboardRouter,
);

companyRouter.use(
  '/checklists',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:checklist']),
  checklistRouter,
);

companyRouter.use(
  '/tickets',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:tickets']),
  ticketRouter,
);

companyRouter.use(
  '/suppliers',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:suppliers']),
  supplierRouter,
);

companyRouter.use(
  '/maintenance-history-activities',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:company']),
  maintenanceHistoryActivitiesRouter,
);

companyRouter.use(
  '/ticketHistoryActivities',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:company']),
  ticketHistoryActivitiesRouter,
);

companyRouter.use(
  '/ticketDismissReasons',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:company']),
  ticketDismissReasonsRouter,
);

companyRouter.get(
  '/serviceTypes',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:company']),
  findManyServiceTypes,
);

companyRouter.get(
  '/priority',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:company']),
  findAllMaintenancePriority,
);

companyRouter.use(
  '/permissions',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:company']),
  permissionsRouter,
);

companyRouter.use(
  '/list',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:company']),
  listForSelectRouter,
);

// upload routes
companyRouter.use('/upload', uploadRouter);

// report routes
companyRouter.put('/report/:reportPDFId', updateReportPDFController);

// home routes
companyRouter.use(
  '/home',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:company']),
  homeRouter,
);
