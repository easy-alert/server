// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getStockMovementsController } from '../../../shared/stockMovement/controllers/getStockMovementsController';

// ROUTES
export const stockMovementsRouter = Router();

stockMovementsRouter.get('/', getStockMovementsController);
