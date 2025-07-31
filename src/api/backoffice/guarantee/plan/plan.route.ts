// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getGuaranteePlanController } from './controller/getGuaranteePlanController';
import { postGuaranteeController } from './controller/postGuaranteeController';
import { putGuaranteeController } from './controller/putGuaranteeController';
import { deleteGuaranteeController } from './controller/deleteGuaranteeController';

// ROUTES
export const planRouter = Router();

// GUARANTEE
planRouter.get('/', getGuaranteePlanController);
planRouter.post('/', postGuaranteeController);
planRouter.put('/:guaranteeId', putGuaranteeController);
planRouter.delete('/:guaranteeId', deleteGuaranteeController);
