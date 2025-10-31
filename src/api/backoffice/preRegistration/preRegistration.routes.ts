import { Router } from 'express';

import { createPreRegistration } from './controllers/createPreRegistrationController';
import { preRegistrationDetailsClient } from './controllers/preRegistrationDetailsClientController';
import { completePreRegistrationController } from './controllers/completePreRegistrationController';
import { listPreRegistrations } from './controllers/listPreRegistrationController';

export const preRegistrationRouter = Router();

preRegistrationRouter.get('/details/:token', preRegistrationDetailsClient);
preRegistrationRouter.get('/status', listPreRegistrations);

preRegistrationRouter.post('/invite', createPreRegistration);
preRegistrationRouter.post('/complete/:token', completePreRegistrationController);
