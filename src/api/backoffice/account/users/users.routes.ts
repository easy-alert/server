// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listUsers } from './controllers/listUsers';

// ROUTES
export const usersRouter = Router();

usersRouter.get('/list', listUsers);
