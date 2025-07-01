// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getFeedItemsController } from '../../shared/feedItems/controllers/getFeedItemsController';
import { postFeedItemController } from '../../shared/feedItems/controllers/postFeedItemController';
import { deleteFeedItemController } from '../../shared/feedItems/controllers/deleteFeedItemController';
import { putFeedItemController } from '../../shared/feedItems/controllers/putFeedItemController';

// ROUTES
export const feedItemRouter = Router();

feedItemRouter.get('/', getFeedItemsController);
feedItemRouter.post('/', postFeedItemController);
feedItemRouter.put('/:id', putFeedItemController);
feedItemRouter.delete('/:id', deleteFeedItemController);
