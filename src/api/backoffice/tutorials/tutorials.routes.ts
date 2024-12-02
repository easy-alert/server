// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getTutorials } from './controllers/getTutorials';
import { postTutorial } from './controllers/postTutorial';

// ROUTES
export const tutorialsRoutes = Router();

tutorialsRoutes.get('/', getTutorials);
tutorialsRoutes.post('/', postTutorial);
