// LIBS
import { Router } from 'express';

// FUNCTIONS
import { createCompanyAndOwner } from './controllers/createCompanyAndOwner';

// ROUTES
export const companyUserRouter = Router();

// BUILDING

companyUserRouter.post('/create', createCompanyAndOwner);
