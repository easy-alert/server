// LIBS
import { Router } from 'express';
import {
  getBuildingsQuantityController,
  getCompaniesQuantityController,
  getUsersQuantityController,
} from './controllers';

// ROUTES
export const dashboardRouter = Router();

dashboardRouter.get('/buildings/quantity', getBuildingsQuantityController);

dashboardRouter.get('/companies/quantity', getCompaniesQuantityController);

dashboardRouter.get('/users/quantity', getUsersQuantityController);
