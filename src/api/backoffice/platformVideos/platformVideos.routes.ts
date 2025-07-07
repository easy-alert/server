// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getPlatformVideosController } from '../../shared/tutorials/controllers/getPlatformVideosController';
import { postPlatformVideoController } from '../../shared/tutorials/controllers/postPlatformVideoController';
import { putPlatformVideoController } from '../../shared/tutorials/controllers/putPlatformVideoController';
import { deletePlatformVideoController } from '../../shared/tutorials/controllers/deletePlatformVideoController';

// ROUTES
export const platformVideosRouter = Router();

platformVideosRouter.get('/', getPlatformVideosController);
platformVideosRouter.post('/', postPlatformVideoController);
platformVideosRouter.put('/:id', putPlatformVideoController);
platformVideosRouter.delete('/:id', deletePlatformVideoController);
