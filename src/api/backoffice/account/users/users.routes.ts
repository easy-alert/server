// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listUsers } from './controllers/listUsers';
import { listUserDetails } from './controllers/listUserDetails';

// ROUTES
export const usersRouter = Router();

usersRouter.get('/list', listUsers);
usersRouter.get('/details/:userId', listUserDetails);
