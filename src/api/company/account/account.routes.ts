// LIBS
import { Router } from 'express';

// FUNCTIONS

import { editCompanyAndOwner } from './controllers/editCompanyAndOwner';

// ROUTES
export const accountRouter = Router();

accountRouter.put('/edit', editCompanyAndOwner);
