// LIBS
import { Router } from 'express';

// VALIDATORS
import { isBackoffice } from '../../../../middlewares/permissions/isBackoffice';

// FUNCTIONS
import { listCompanies } from './controllers/listCompanies';
import { createCompanyAndOwner } from './controllers/createCompanyAndOwner';
import { changeIsBlocked } from './controllers/changeIsBlocked';
import { deleteCompany } from './controllers/deleteComany';
import { editCompanyAndOwner } from './controllers/editCompanyAndOwner';

// ROUTES
export const backofficeCompanyRouter = Router();

backofficeCompanyRouter.post('/create', isBackoffice, createCompanyAndOwner);
backofficeCompanyRouter.get('/list', isBackoffice, listCompanies);
backofficeCompanyRouter.put('/change/isBlocked', isBackoffice, changeIsBlocked);
backofficeCompanyRouter.put('/edit', isBackoffice, editCompanyAndOwner);

backofficeCompanyRouter.delete('/delete', isBackoffice, deleteCompany);
