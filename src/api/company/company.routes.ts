// LIBS
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerFile from '../../docs/companyDocs.json';

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

companyRouter.use('/account', authMiddleware, isCompany, accountRouter);

companyRouter.use('/categories', authMiddleware, isCompany, categoryRouter);

companyRouter.use('/buildings', authMiddleware, isCompany, buildingRouter);

companyRouter.use('/maintenances', authMiddleware, isCompany, maintenanceRouter);

companyRouter.use('/calendars', authMiddleware, isCompany, calendarRouter);

companyRouter.post('/passwordrecovery/sendemail', sendEmailForRecoveryPassword);

companyRouter.put('/passwordrecovery/change', changePassword);

companyRouter.use('/dashboard', authMiddleware, isCompany, dashboardRouter);

companyRouter.use('/checklists', authMiddleware, isCompany, checklistRouter);

companyRouter.use('/tickets', authMiddleware, isCompany, ticketRouter);

companyRouter.use('/suppliers', authMiddleware, isCompany, supplierRouter);

companyRouter.use(
  '/maintenance-history-activities',
  authMiddleware,
  isCompany,
  maintenanceHistoryActivitiesRouter,
);

companyRouter.use(
  '/ticketHistoryActivities',
  authMiddleware,
  isCompany,
  ticketHistoryActivitiesRouter,
);

companyRouter.use('/ticketDismissReasons', authMiddleware, isCompany, ticketDismissReasonsRouter);
