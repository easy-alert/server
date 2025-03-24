// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listCompanies } from './controllers/listCompanies';
import { createCompanyAndOwner } from './controllers/createCompanyAndOwner';
import { changeIsBlocked } from './controllers/changeIsBlocked';
import { deleteCompany } from './controllers/deleteCompany';
import { editCompanyAndOwner } from './controllers/editCompanyAndOwner';
import { listCompanyDetails } from './controllers/listCompanyDetails';
import { listBuildingAccessHistories } from './controllers/listBuildingAccessHistory';

// ROUTES
export const companiesRouter = Router();

companiesRouter.get('/list', listCompanies);
companiesRouter.get('/list/details/:companyId', listCompanyDetails);
companiesRouter.get('/list/access-history/:companyId', listBuildingAccessHistories);

companiesRouter.post('/create', createCompanyAndOwner);

companiesRouter.put('/change/isBlocked', changeIsBlocked);
companiesRouter.put('/edit', editCompanyAndOwner);

companiesRouter.delete('/delete', deleteCompany);
