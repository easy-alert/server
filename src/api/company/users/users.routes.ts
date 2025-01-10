// LIBS
import { Router } from 'express';

// CONTROLLERS
import { findUserByIdController } from './controllers/findUserByIdController';

// ROUTES
export const usersRouter = Router();

usersRouter.get('/');
usersRouter.get('/details', findUserByIdController);
