// LIBS
import { Router } from 'express';
import { backofficeRouter } from './backoffice/backoffice.routes';
import { companyRouter } from './company/company.routes';
import { clientRouter } from './client/client.routes';

// ROUTES
export const routes: Router = Router();

routes.use('/backoffice', backofficeRouter);
routes.use('/company', companyRouter);
routes.use('/client', clientRouter);
