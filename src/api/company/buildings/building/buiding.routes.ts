// LIBS
import { Router } from 'express';
import { listBuildingTypes } from '../buildingsTypes/controllers/listBuilding';
import { createBuilding } from './controllers/createBuilding';
import { deleteBuilding } from './controllers/deleteBuilding';
import { editBuilding } from './controllers/editBuilding';
import { listBuilding } from './controllers/listBuilding';
import { listBuildingDetails } from './controllers/listBuildingDetails';

// FUNCTIONS

// ROUTES
export const buildingRouter = Router();

buildingRouter.post('/create', createBuilding);
buildingRouter.put('/edit', editBuilding);
buildingRouter.get('/list', listBuilding);
buildingRouter.get('/list/details/:buildingId', listBuildingDetails);
buildingRouter.delete('/delete', deleteBuilding);
buildingRouter.get('/types/list', listBuildingTypes);
