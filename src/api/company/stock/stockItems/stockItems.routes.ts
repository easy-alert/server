// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getStockItemController } from '../../../shared/stockItem/controllers/getStockItemController';
import { createStockItemController } from '../../../shared/stockItem/controllers/createStockItemController';
import { putStockItemController } from '../../../shared/stockItem/controllers/putStockItemController';
import { deleteStockItemController } from '../../../shared/stockItem/controllers/deleteStockItemController';

// ROUTES
export const stockItemsRouter = Router();

stockItemsRouter.get('/', getStockItemController);
stockItemsRouter.post('/', createStockItemController);
stockItemsRouter.put('/', putStockItemController);
stockItemsRouter.delete('/:stockItemId', deleteStockItemController);
