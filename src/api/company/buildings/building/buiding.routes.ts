// LIBS
import { Router } from 'express';
import { createBuilding } from './controllers/createBuilding';

// FUNCTIONS

// ROUTES
export const buildingRouter = Router();

buildingRouter.post('/create', createBuilding);
