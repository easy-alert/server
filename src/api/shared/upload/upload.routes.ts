// LIBS
import { Router } from 'express';

// FUNCTIONS
import { upload } from './upload';
import { uploadMany } from './uploadMany';

// ROUTES
export const uploadRouter = Router();

uploadRouter.post('/file', upload);
uploadRouter.post('/files', uploadMany);
