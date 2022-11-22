// LIBS
import { Router } from 'express';

// FUNCTIONS
import { createBuildingAnnexe } from './controllers';

// ROUTES
export const buildingAnnexeRouter = Router();

buildingAnnexeRouter.post('/create', createBuildingAnnexe);
