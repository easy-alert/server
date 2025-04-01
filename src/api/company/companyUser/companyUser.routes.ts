// LIBS
import { Router } from 'express';

// FUNCTIONS
import { createCompanyAndOwner } from './controllers/createCompanyAndOwner';
import { updateUserController } from './controllers/updateUserController';
import { deleteUserController } from './controllers/deleteUserController';
import { createUserController } from './controllers/createUserController';
import { authMiddleware } from '../../../middlewares/auth';
import { isCompany } from '../../../middlewares/permissions/isCompany';
import { handleCompanyPermCheck } from '../../../middlewares/permissions/permCheck';
import { unlinkUserController } from './controllers/unlinkUserController';
import { linkUserController } from './controllers/linkUserController';

const companyPermission = 'access:company';

export const companyUserRouter = Router();

companyUserRouter.post('/create', createCompanyAndOwner);

companyUserRouter.post(
  '/create-user',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:account']),
  isCompany,
  createUserController,
);

companyUserRouter.post(
  '/link-user',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:account']),
  isCompany,
  linkUserController,
);

companyUserRouter.put(
  '/update',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:account']),
  isCompany,
  updateUserController,
);

companyUserRouter.delete(
  '/delete/:userId',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:account']),
  isCompany,
  deleteUserController,
);

companyUserRouter.delete(
  '/unlink/:userId',
  authMiddleware,
  handleCompanyPermCheck([companyPermission, 'access:account']),
  isCompany,
  unlinkUserController,
);
