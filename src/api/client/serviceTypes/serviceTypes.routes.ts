import { Router } from 'express';

import { findManyServiceTypes } from '../../shared/serviceTypes/controllers/findManyServiceTypes';

export const serviceTypesRouter = Router();

serviceTypesRouter.get('/findMany', findManyServiceTypes);
