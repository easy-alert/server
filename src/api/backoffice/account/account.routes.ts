// LIBS
import { Router } from 'express';

// ROUTES
import { companiesRouter } from './companies/companies.routes';

// ROUTES
export const accountRouter = Router();

accountRouter.use('/companies', companiesRouter);

accountRouter.use('/users', companiesRouter);
