// LIBS
import { Router } from 'express';

// ROUTES
import { failureTypesRouter } from './failureType/failureTypes.routes';

// ROUTES
export const guaranteeRouter = Router();

// FAILURE TYPES
guaranteeRouter.use('/failure-types', failureTypesRouter);
