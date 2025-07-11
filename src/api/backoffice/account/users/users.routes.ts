// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listUsers } from './controllers/listUsers';
import { listUserDetails } from './controllers/listUserDetails';
import { editUserController } from './controllers/editUserController';
import { changeIsBlockedUser } from './controllers/changeIsBlockedUser';
import { createUser } from './controllers/createUser';

// ROUTES
export const usersRouter = Router();

usersRouter.get('/list', listUsers);
usersRouter.get('/details/:userId', listUserDetails);

usersRouter.put('/editUser', editUserController);
usersRouter.put('/changeIsBlockedUser', changeIsBlockedUser);
usersRouter.put('/edit/:userId', editUserController);

usersRouter.post('/create', createUser);
