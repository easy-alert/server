// LIBS
import { Router } from 'express';

// FUNCTIONS
import { uploadFile } from './upload';
import { uploadMany } from './uploadMany';
import { uploadBase64 } from './uploadBase64';

// ROUTES
export const uploadRouter = Router();

uploadRouter.post('/file', uploadFile);
uploadRouter.post('/files', uploadMany);
uploadRouter.post('/base64', uploadBase64);
