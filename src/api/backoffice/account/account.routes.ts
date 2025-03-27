// LIBS
import { Router } from 'express';

// ROUTES
import { companiesRouter } from './companies/companies.routes';
import { usersRouter } from './users/users.routes';

// ROUTES
export const accountRouter = Router();

accountRouter.use('/companies', companiesRouter);

accountRouter.use('/users', usersRouter);
