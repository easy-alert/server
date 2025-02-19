// LIBS
import { Router } from 'express';

// CONTROLLERS
import { listBuildingsForSelectController } from './controllers/listBuildingsForSelectController';
import { listUsersForSelectController } from './controllers/listUsersForSelectController';

// ROUTES
export const listForSelectRouter = Router();

listForSelectRouter.get('/buildings', listBuildingsForSelectController);
listForSelectRouter.get('/users', listUsersForSelectController);
