// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listBuildings } from './controllers/listBuildings';
import { listBuildingsDetails } from './controllers/listBuildingsDetails';

// ROUTES
export const buildingRouter = Router();

// BUILDING

buildingRouter.get('/list', listBuildings);
buildingRouter.get('/list/details/:buildingId', listBuildingsDetails);
