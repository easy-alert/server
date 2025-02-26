// LIBS
import { Router } from 'express';

// CONTROLLERS
import { findUserByIdController } from './controllers/findUserByIdController';
import { findUserPermissionsController } from './controllers/findUserPermissionsController';
import { sendPhoneConfirmationController } from './controllers/sendPhoneConfirmationController';
import { sendEmailConfirmationController } from './controllers/sendEmailConfirmationController';

// ROUTES
export const usersRouter = Router();

usersRouter.get('/');
usersRouter.get('/details', findUserByIdController);
usersRouter.get('/permissions', findUserPermissionsController);

// SEND CONFIRMATION
usersRouter.post('/confirm/phone', sendPhoneConfirmationController);
usersRouter.post('/confirm/email', sendEmailConfirmationController);
