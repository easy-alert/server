// LIBS
import { Router } from 'express';
import { backofficeRouter } from './backoffice/backoffice.routes';
import { companyRouter } from './company/company.routes';

// ROUTES
export const routes: Router = Router();

routes.use('/backoffice', backofficeRouter);
routes.use('/company', companyRouter);
