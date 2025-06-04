// LIBS
import { Router } from 'express';
import {
  getBuildingsQuantityController,
  getCompaniesQuantityController,
  getMostActiveCompaniesController,
  getUsersQuantityController,
} from './controllers';

// ROUTES
export const dashboardRouter = Router();

dashboardRouter.get('/buildings/quantity', getBuildingsQuantityController);

dashboardRouter.get('/companies/quantity', getCompaniesQuantityController);
dashboardRouter.get('/companies/ranking/most-active', getMostActiveCompaniesController);

dashboardRouter.get('/users/quantity', getUsersQuantityController);
