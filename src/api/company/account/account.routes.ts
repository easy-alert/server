// LIBS
import { Router } from 'express';

// FUNCTIONS

import { updateCompanyController } from './controllers/updateCompanyController';
import { updateUserController } from './controllers/updateUserController';

// ROUTES
export const accountRouter = Router();

accountRouter.put('/company', updateCompanyController);

accountRouter.put('/user', updateUserController);
