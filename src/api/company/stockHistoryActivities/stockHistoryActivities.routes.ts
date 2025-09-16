import { Router } from 'express';

import { createStockHistoryActivity } from '../../shared/stockHistoryActivities/controllers/createStockHistoryActivity';
import { findStockHistoryActivitiesById } from '../../shared/stockHistoryActivities/controllers/findStockHistoryActivitiesById';

export const stockHistoryActivitiesRouter: Router = Router();

stockHistoryActivitiesRouter.get('/:stockId', findStockHistoryActivitiesById);
stockHistoryActivitiesRouter.post('/', createStockHistoryActivity);
