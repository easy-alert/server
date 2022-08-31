// LIBS
import { Router } from 'express';

// VALIDATORS
import { isBackoffice } from '../../../../middlewares/permissions/isBackoffice';

// FUNCTIONS
import { listCompanies } from './listCompanies';
import { createCompanyAndOwner } from './createCompanyAndOwner';

// ROUTES
export const backofficeCompanyRouter = Router();

backofficeCompanyRouter.post('/create', isBackoffice, createCompanyAndOwner);
backofficeCompanyRouter.post('/list', isBackoffice, listCompanies);
