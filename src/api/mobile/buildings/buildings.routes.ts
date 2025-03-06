// LIBS
import { Router } from 'express';

import { getBuildingLogo } from './controller/getBuildingLogo';

// FUNCTIONS

// ROUTES
export const buildingsRoutes = Router();

buildingsRoutes.get('/:buildingId/logo', getBuildingLogo);
