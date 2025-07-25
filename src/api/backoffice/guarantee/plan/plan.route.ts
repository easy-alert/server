// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getGuaranteePlanController } from './controller/getGuaranteePlanController';
import { postGuaranteeController } from './controller/postGuaranteeController';

// ROUTES
export const planRouter = Router();

// FAILURE TYPES
planRouter.get('/', getGuaranteePlanController);
planRouter.post('/', postGuaranteeController);
