// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listUsers } from './controllers/listUsers';
import { listUserDetails } from './controllers/listUserDetails';
import { createUser } from './controllers/createUser';

// ROUTES
export const usersRouter = Router();

usersRouter.get('/list', listUsers);
usersRouter.get('/details/:userId', listUserDetails);

usersRouter.post('/create', createUser);
