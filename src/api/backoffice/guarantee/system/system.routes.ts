// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getGuaranteeSystemController } from '../../../shared/guarantee/system/controllers/getGuaranteeSystemController';
import { postGuaranteeSystemsController } from '../../../shared/guarantee/system/controllers/postGuaranteeSystemsController';
import { deleteGuaranteeSystemController } from '../../../shared/guarantee/system/controllers/deleteGuaranteeSystemController';
import { putGuaranteeSystemController } from '../../../shared/guarantee/system/controllers/putGuaranteeSystemController';

// ROUTES
export const systemRouter = Router();

// FAILURE TYPES
systemRouter.get('/list', getGuaranteeSystemController);
systemRouter.post('/', postGuaranteeSystemsController);
systemRouter.put('/:guaranteeSystemId', putGuaranteeSystemController);
systemRouter.delete('/:guaranteeSystemId', deleteGuaranteeSystemController);
