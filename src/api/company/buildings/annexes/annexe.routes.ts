// LIBS
import { Router } from 'express';

// FUNCTIONS
import { createBuildingAnnexe, deleteBuildingAnnexe } from './controllers';

// ROUTES
export const buildingAnnexeRouter = Router();

buildingAnnexeRouter.post('/create', createBuildingAnnexe);
buildingAnnexeRouter.delete('/delete', deleteBuildingAnnexe);
