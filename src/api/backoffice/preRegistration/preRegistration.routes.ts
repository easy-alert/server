import { Router } from 'express';

import { createPreRegistration } from './controllers/createPreRegistrationController';
import { preRegistrationDetailsClient } from './controllers/preRegistrationDetailsClientController';

export const preRegistrationRouter = Router();

preRegistrationRouter.post('/invite', createPreRegistration);

preRegistrationRouter.get('/details/:token', preRegistrationDetailsClient);
