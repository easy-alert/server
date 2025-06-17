// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listBuildings } from './controllers/listBuildings';

// ROUTES
export const buildingRouter = Router();

// BUILDING

buildingRouter.get('/list', listBuildings);
