// LIBS
import { Router } from 'express';

// CONTROLLERS
import { listBuildingsForSelectController } from './controllers/listBuildingsForSelectController';

// ROUTES
export const listForSelectRouter = Router();

listForSelectRouter.get('/buildings', listBuildingsForSelectController);
