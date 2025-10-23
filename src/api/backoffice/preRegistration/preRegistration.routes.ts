import { Router } from 'express';

import { createPreRegistration } from './controllers/createPreRegistrationController';
import { preRegistrationDetailsClient } from './controllers/preRegistrationDetailsClientController';
import { completePreRegistrationController } from './controllers/completePreRegistrationController';

export const preRegistrationRouter = Router();

preRegistrationRouter.post('/invite', createPreRegistration);

preRegistrationRouter.get('/details/:token', preRegistrationDetailsClient);

preRegistrationRouter.post('/complete/:token', completePreRegistrationController);
