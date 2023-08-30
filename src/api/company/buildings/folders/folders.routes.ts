// LIBS
import { Router } from 'express';

// FUNCTIONS
import { filesRouter } from '../folderFiles/files.routes';
import {
  createFolderController,
  deleteFolderController,
  editFolderController,
  listFolderController,
} from './controllers';

// ROUTES
export const foldersRouter = Router();

// BUILDING
foldersRouter.post('/create', createFolderController);
foldersRouter.put('/edit', editFolderController);
foldersRouter.get('/list/:folderId', listFolderController);
foldersRouter.delete('/delete/:folderId', deleteFolderController);
foldersRouter.use('/files', filesRouter);
