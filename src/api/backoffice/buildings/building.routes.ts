// LIBS
import { Router } from 'express';

// FUNCTIONS
import { listBuildings } from './controllers/listBuildings';
import { getBuildingDetails } from './controllers/getBuildingDetails';

import { editBuildingController } from './controllers/editBuildingController';
import { changeIsBlockedBuilding } from './controllers/changeIsBlockedBuilding';
import { getBuildingTypes } from './controllers/getBuildingTypes';

// ROUTES
export const buildingRouter = Router();

// BUILDING
buildingRouter.get('/list', listBuildings);
buildingRouter.get('/list/details/:buildingId', getBuildingDetails);
buildingRouter.get('/types/list', getBuildingTypes);

buildingRouter.put('/edit/:buildingId', editBuildingController);
buildingRouter.put('/changeIsBlockedBuilding', changeIsBlockedBuilding);
