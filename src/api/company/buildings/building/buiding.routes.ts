// LIBS
import { Router } from 'express';
import { createBuilding } from './controllers/createBuilding';
import { deleteBuilding } from './controllers/deleteBuilding';
import { editBuilding } from './controllers/editBuilding';
import { listBuilding } from './controllers/listBuilding';

// FUNCTIONS

// ROUTES
export const buildingRouter = Router();

buildingRouter.post('/create', createBuilding);
buildingRouter.put('/edit', editBuilding);
buildingRouter.get('/list', listBuilding);
buildingRouter.delete('/delete', deleteBuilding);
