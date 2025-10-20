import { Router } from 'express';
import { createPreRegistration } from './controllers/createPreRegistrationController';

export const preRegistrationRouter = Router();

preRegistrationRouter.post('/invite', createPreRegistration);
