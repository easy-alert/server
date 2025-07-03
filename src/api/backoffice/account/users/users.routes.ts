// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listUsers } from './controllers/listUsers';
import { listUserDetails } from './controllers/listUserDetails';
import { editUserController } from './controllers/editUserController';
import { changeIsBlockedUser } from './controllers/changeIsBlockedUser';

// ROUTES
export const usersRouter = Router();

usersRouter.get('/list', listUsers);
usersRouter.get('/details/:userId', listUserDetails);

usersRouter.put('/editUser', editUserController);
usersRouter.put('/changeIsBlockedUser', changeIsBlockedUser);
