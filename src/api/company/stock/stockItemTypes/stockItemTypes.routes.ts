// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getStockItemTypeController } from '../../../shared/stockItemType/controllers/getStockItemTypeController';
import { createStockItemTypeController } from '../../../shared/stockItemType/controllers/createStockItemTypeController';
import { putStockItemTypeController } from '../../../shared/stockItemType/controllers/putStockItemTypeController';
import { deleteStockItemTypeController } from '../../../shared/stockItemType/controllers/deleteStockItemTypeController';

// ROUTES
export const stockItemTypesRouter = Router();

stockItemTypesRouter.get('/', getStockItemTypeController);
stockItemTypesRouter.post('/', createStockItemTypeController);
stockItemTypesRouter.put('/', putStockItemTypeController);
stockItemTypesRouter.delete('/:stockItemTypeId', deleteStockItemTypeController);
