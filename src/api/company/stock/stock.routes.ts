// LIBS
import { Router } from 'express';

// CONTROLLERS
// import { stockInventoryRouter } from './stockInventory/stockInventory.routes';
import { stockItemsRouter } from './stockItems/stockItems.routes';
import { stockItemTypesRouter } from './stockItemTypes/stockItemTypes.routes';
import { stockMovementsRouter } from './stockMovements/stockMovements.routes';

// ROUTES
export const stockRouter = Router();

// STOCK INVENTORY
// stockRouter.use('/inventory', stockInventoryRouter);

// STOCK ITEMS
stockRouter.use('/items', stockItemsRouter);

// STOCK ITEM TYPES
stockRouter.use('/item-types', stockItemTypesRouter);

// STOCK MOVEMENTS
stockRouter.use('/movements', stockMovementsRouter);
