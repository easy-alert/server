import { Router } from 'express';
import { createPreRegistrationController } from './controllers/createPreRegistrationController';

export const preRegistrationRouter = Router();

preRegistrationRouter.post('/invite', createPreRegistrationController);
