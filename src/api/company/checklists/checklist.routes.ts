import { Router } from 'express';
import { createChecklistController } from '../../shared/checklists/controllers/createChecklistController';
import { findManyChecklistsController } from '../../shared/checklists/controllers/findManyChecklistsController';
import { deleteChecklistController } from '../../shared/checklists/controllers/deleteChecklistController';
import { findChecklistByIdController } from '../../shared/checklists/controllers/findChecklistByIdController';
import { completeChecklistController } from '../../shared/checklists/controllers/completeChecklistController';

export const checklistRouter: Router = Router();

checklistRouter.get('/:checklistId', findChecklistByIdController);
checklistRouter.get('/:buildingId/:date', findManyChecklistsController);

checklistRouter.post('/', createChecklistController);

checklistRouter.delete('/:checklistId/:mode', deleteChecklistController);

checklistRouter.put('/complete', completeChecklistController);
