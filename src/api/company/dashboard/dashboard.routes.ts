// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listAuxiliaryData, listData } from './controllers';

// ROUTES
export const dashboardRouter = Router();

dashboardRouter.get('/list-data', listData);
dashboardRouter.get('/list-auxiliary-data', listAuxiliaryData);
