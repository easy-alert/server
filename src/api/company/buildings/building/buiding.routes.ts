// LIBS
import { Router } from 'express';
import { createBuilding } from './controllers/createBuilding';
import { listBuilding } from './controllers/listBuilding';

// FUNCTIONS

// ROUTES
export const buildingRouter = Router();

buildingRouter.post('/create', createBuilding);
buildingRouter.get('/list', listBuilding);
