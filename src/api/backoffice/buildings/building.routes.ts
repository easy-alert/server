// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listBuilding } from '../../company/buildings/building/controllers';

// ROUTES
export const buildingRouter = Router();

// BUILDING

buildingRouter.get('/list', listBuilding);
