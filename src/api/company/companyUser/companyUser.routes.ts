// LIBS
import { Router } from 'express';

// FUNCTIONS
import { createCompanyAndOwner } from './controllers/createCompanyAndOwner';
import { updateUserController } from './controllers/updateUserController';
import { deleteUserController } from './controllers/deleteUserController';
import { createUserController } from './controllers/createUserController';

// ROUTES
export const companyUserRouter = Router();

// BUILDING

companyUserRouter.post('/create', createCompanyAndOwner);
companyUserRouter.post('/create-user', createUserController);

companyUserRouter.put('/update', updateUserController);

companyUserRouter.delete('/delete/:userId', deleteUserController);
