// LIBS
import { Router } from 'express';

// ROUTES
import { failureTypesRouter } from './failureType/failureTypes.routes';
import { systemRouter } from './system/system.routes';

// ROUTES
export const guaranteeRouter = Router();

// FAILURE TYPES
guaranteeRouter.use('/failure-types', failureTypesRouter);

// SYSTEM
guaranteeRouter.use('/systems', systemRouter);
