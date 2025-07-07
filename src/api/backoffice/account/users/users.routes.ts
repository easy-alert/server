// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listUsers } from './controllers/listUsers';
import { listUserDetails } from './controllers/listUserDetails';
import { editUserController } from './controllers/editUserController';

// ROUTES
export const usersRouter = Router();

usersRouter.get('/list', listUsers);
usersRouter.get('/details/:userId', listUserDetails);

usersRouter.put('/edit/:userId', editUserController);
