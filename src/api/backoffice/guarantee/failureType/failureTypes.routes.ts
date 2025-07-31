// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getGuaranteeFailureTypesController } from '../../../shared/guarantee/failureTypes/controllers/getGuaranteeFailureTypesController';
import { postGuaranteeFailureTypesController } from '../../../shared/guarantee/failureTypes/controllers/postGuaranteeFailureTypesController';
import { deleteGuaranteeFailureTypesController } from '../../../shared/guarantee/failureTypes/controllers/deleteGuaranteeFailureTypesController';
import { putGuaranteeFailureTypesController } from '../../../shared/guarantee/failureTypes/controllers/putGuaranteeFailureTypesController';

// ROUTES
export const failureTypesRouter = Router();

// FAILURE TYPES
failureTypesRouter.get('/list', getGuaranteeFailureTypesController);
failureTypesRouter.post('/', postGuaranteeFailureTypesController);
failureTypesRouter.put('/:guaranteeFailureTypeId', putGuaranteeFailureTypesController);
failureTypesRouter.delete('/:guaranteeFailureTypeId', deleteGuaranteeFailureTypesController);
