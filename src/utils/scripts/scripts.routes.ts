import { Router } from 'express';
import { createDefaultTemplates } from './createDefaultTemplates';

// ROUTES
export const scriptRouter: Router = Router();

scriptRouter.post('/templates/create', createDefaultTemplates);
