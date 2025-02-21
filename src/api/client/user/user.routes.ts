// LIBS
import { Router } from 'express';

// CONTROLLERS
import { findUserByIdController } from './controller/findUserByIdController';

// ROUTES
export const userRouter = Router();

// BUILDINGS
userRouter.get('/:userId', findUserByIdController);
