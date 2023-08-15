import { Router } from 'express';
import { createDefaultTemplates } from './createDefaultTemplates';
import { createBuildingFolders } from './createBuildingFolders';

// ROUTES
export const scriptRouter: Router = Router();

scriptRouter.post('/templates/create', createDefaultTemplates);
scriptRouter.get('/buildings/create-folders', createBuildingFolders);
