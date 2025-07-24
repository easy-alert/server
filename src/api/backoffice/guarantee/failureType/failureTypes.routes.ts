// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getGuaranteeFailureTypesController } from '../../../shared/guarantee/failureTypes/controllers/getGuaranteeFailureTypesController';

// ROUTES
export const failureTypesRouter = Router();

// FAILURE TYPES
failureTypesRouter.use('/list', getGuaranteeFailureTypesController);

