// LIBS
import { Router } from 'express';

// FUNCTIONS
import { createCompanyAndOwner } from './controllers/createCompanyAndOwner';
import { updateUserController } from './controllers/updateUserController';
import { deleteUserController } from './controllers/deleteUserController';
import { createUserController } from './controllers/createUserController';
import { authMiddleware } from '../../../middlewares/auth';
import { isCompany } from '../../../middlewares/permissions/isCompany';

export const companyUserRouter = Router();

companyUserRouter.post('/create', createCompanyAndOwner);

companyUserRouter.post('/create-user', authMiddleware, isCompany, createUserController);

companyUserRouter.put('/update', authMiddleware, isCompany, updateUserController);

companyUserRouter.delete('/delete/:userId', authMiddleware, isCompany, deleteUserController);
