// LIBS
import { Router } from 'express';

// CONTROLLERS
import { findUserByIdController } from './controllers/findUserByIdController';
import { findUserPermissionsController } from './controllers/findUserPermissionsController';

// ROUTES
export const usersRouter = Router();

usersRouter.get('/');
usersRouter.get('/details', findUserByIdController);
usersRouter.get('/permissions', findUserPermissionsController);
