// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getTutorials } from '../../shared/tutorials/controllers/getTutorials';
import { postTutorial } from '../../shared/tutorials/controllers/postTutorial';
import { putTutorial } from '../../shared/tutorials/controllers/putTutorial';
import { deleteTutorial } from '../../shared/tutorials/controllers/deleteTutorial';

// ROUTES
export const tutorialsRouter = Router();

tutorialsRouter.get('/', getTutorials);
tutorialsRouter.post('/', postTutorial);
tutorialsRouter.put('/:id', putTutorial);
tutorialsRouter.delete('/:id', deleteTutorial);
