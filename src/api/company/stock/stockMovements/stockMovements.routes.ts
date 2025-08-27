// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getStockMovementsController } from '../../../shared/stockMovement/controllers/getStockMovementsController';
import { createStockMovementsController } from '../../../shared/stockMovement/controllers/createStockMovementsController';

// ROUTES
export const stockMovementsRouter = Router();

stockMovementsRouter.get('/', getStockMovementsController);
stockMovementsRouter.post('/', createStockMovementsController);
