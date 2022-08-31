// LIBS
import { Router } from 'express';

// VALIDATORS
import { isBackoffice } from '../../../../../middlewares/permissions/isBackoffice';

// FUNCTIONS
import { createUser } from './createUser';
import { listUsers } from './listUsers';
import { editUser } from './editUser';
import { changeIsBlocked } from './changeIsBlocked';

// ROUTES
export const backofficeUserRouter = Router();

backofficeUserRouter.post('/create', isBackoffice, createUser);
backofficeUserRouter.get('/list', isBackoffice, listUsers);
backofficeUserRouter.put('/edit', isBackoffice, editUser);
backofficeUserRouter.put('/change/isBlocked', isBackoffice, changeIsBlocked);
