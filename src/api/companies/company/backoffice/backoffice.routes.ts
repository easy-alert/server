// LIBS
import { Router } from 'express';

// VALIDATORS
import { isBackoffice } from '../../../../middlewares/permissions/isBackoffice';

// FUNCTIONS
import { listCompanies } from './listCompanies';
import { createCompanyAndOwner } from './createCompanyAndOwner';
import { changeIsBlocked } from './changeIsBlocked';
import { deleteCompany } from './deleteComany';
import { editCompanyAndOwner } from './editCompanyAndOwner';

// ROUTES
export const backofficeCompanyRouter = Router();

backofficeCompanyRouter.post('/create', isBackoffice, createCompanyAndOwner);
backofficeCompanyRouter.get('/list', isBackoffice, listCompanies);
backofficeCompanyRouter.put('/change/isBlocked', isBackoffice, changeIsBlocked);
backofficeCompanyRouter.put('/edit', isBackoffice, editCompanyAndOwner);

backofficeCompanyRouter.delete('/delete', isBackoffice, deleteCompany);
