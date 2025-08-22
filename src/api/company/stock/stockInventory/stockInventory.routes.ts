// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getStockController } from '../../../shared/stock/controllers/getStockController';
import { getStockByIdController } from '../../../shared/stock/controllers/getStockByIdController';
import { createStockController } from '../../../shared/stock/controllers/createStockController';
import { putStockItemController } from '../../../shared/stockItem/controllers/putStockItemController';
import { deleteStockController } from '../../../shared/stock/controllers/deleteStockController';

// ROUTES
export const stockInventoryRouter = Router();

stockInventoryRouter.get('/', getStockController);
stockInventoryRouter.get('/details/:stockId', getStockByIdController);
stockInventoryRouter.post('/', createStockController);
stockInventoryRouter.put('/', putStockItemController);
stockInventoryRouter.delete('/:stockId', deleteStockController);
