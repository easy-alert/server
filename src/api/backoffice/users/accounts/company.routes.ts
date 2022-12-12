// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listCompanies } from './controllers/listCompanies';
import { createCompanyAndOwner } from './controllers/createCompanyAndOwner';
import { changeIsBlocked } from './controllers/changeIsBlocked';
import { deleteCompany } from './controllers/deleteCompany';
import { editCompanyAndOwner } from './controllers/editCompanyAndOwner';
import { listCompanyDetails } from './controllers/listCompanyDetails';

// ROUTES
export const companyRouter = Router();

companyRouter.post('/create', createCompanyAndOwner);
companyRouter.get('/list', listCompanies);
companyRouter.get('/list/details/:companyId', listCompanyDetails);
companyRouter.put('/change/isBlocked', changeIsBlocked);
companyRouter.put('/edit', editCompanyAndOwner);

companyRouter.delete('/delete', deleteCompany);
