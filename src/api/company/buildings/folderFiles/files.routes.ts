// LIBS
import { Router } from 'express';

// FUNCTIONS
import { createFilesController, deleteFileController, editFileController } from './controllers';

// ROUTES
export const filesRouter = Router();

// BUILDING
filesRouter.post('/create', createFilesController);
filesRouter.put('/edit', editFileController);
filesRouter.delete('/delete/:fileId', deleteFileController);
