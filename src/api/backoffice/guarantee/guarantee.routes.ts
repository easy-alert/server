// LIBS
import { Router } from 'express';

// ROUTES
import { planRouter } from './plan/plan.route';
import { failureTypesRouter } from './failureType/failureTypes.routes';
import { systemRouter } from './system/system.routes';

// ROUTES
export const guaranteeRouter = Router();

// PLAN
guaranteeRouter.use('/plan', planRouter);

// FAILURE TYPES
guaranteeRouter.use('/failure-types', failureTypesRouter);

// SYSTEM
guaranteeRouter.use('/systems', systemRouter);
