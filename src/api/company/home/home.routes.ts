// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getFeedItemsController } from './controllers/getFeedItemsController';
import { getCompletedMaintenancesRankController } from './controllers/getCompletedMaintenancesRankController';
import { getLastFeaturePlatformVideoController } from './controllers/getLastFeaturePlatformVideoController';

// ROUTES
export const homeRouter = Router();

// FEED ITEMS
homeRouter.get('/feed', getFeedItemsController);

// COMPANY COMPLETED MAINTENANCE RANK
homeRouter.get('/rank/company/maintenances/completed', getCompletedMaintenancesRankController);

// LAST FEATURE PLATFORM UPDATE
homeRouter.get('/platform-videos/last-feature', getLastFeaturePlatformVideoController);
