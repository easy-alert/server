import { Router } from 'express';
import { createChecklistController } from '../../shared/checklists/controllers/createChecklistController';
import { findManyChecklistsController } from '../../shared/checklists/controllers/findManyChecklistsController';
import { deleteChecklistController } from '../../shared/checklists/controllers/deleteChecklistController';
import { findChecklistByIdController } from '../../shared/checklists/controllers/findChecklistByIdController';
import { completeChecklistController } from '../../shared/checklists/controllers/completeChecklistController';
import { updateChecklistReportController } from '../../shared/checklists/controllers/updateChecklistReportController';
import { updateChecklistController } from '../../shared/checklists/controllers/updateChecklistController';
import { findChecklistDataByMonthController } from '../../shared/checklists/controllers/findChecklistDataByMonthController';
import { findChecklistReportController } from '../../shared/checklists/controllers/findChecklistReportController';

export const checklistRouter: Router = Router();

checklistRouter.get('/reports', findChecklistReportController);
checklistRouter.get('/:checklistId', findChecklistByIdController);
checklistRouter.get('/:buildingNanoId/:date', findManyChecklistsController);
checklistRouter.get('/:buildingNanoId/calendar/dates', findChecklistDataByMonthController);

checklistRouter.post('/', createChecklistController);

checklistRouter.delete('/:checklistId/:mode', deleteChecklistController);

checklistRouter.put('/complete', completeChecklistController);
checklistRouter.put('/reports', updateChecklistReportController);
checklistRouter.put('/', updateChecklistController);
