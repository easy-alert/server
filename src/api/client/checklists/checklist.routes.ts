import { Router } from 'express';

import { findManyChecklistsController } from '../../shared/checklists/controllers/findManyChecklistsController';
import { findChecklistByIdController } from '../../shared/checklists/controllers/findChecklistByIdController';
import { updateChecklistReportController } from '../../shared/checklists/controllers/updateChecklistReportController';
import { findChecklistDataByMonthController } from '../../shared/checklists/controllers/findChecklistDataByMonthController';
import { findChecklistReportController } from '../../shared/checklists/controllers/findChecklistReportController';
import { createChecklistTemplateController } from '../../shared/checklists/controllers/createChecklistTemplateController';
import { getChecklistsTemplatesController } from '../../shared/checklists/controllers/getChecklistsTemplatesController';
import { getChecklistsController } from '../../shared/checklists/controllers/getChecklistsController';
import { getChecklistsByBuildingIdController } from '../../shared/checklists/controllers/getChecklistsByBuildingIdController';
import { createChecklistController } from '../../shared/checklists/controllers/createChecklistController';
import { updateChecklistController } from '../../shared/checklists/controllers/updateChecklistController';
import { deleteChecklistController } from '../../shared/checklists/controllers/deleteChecklistController';

export const checklistRouter: Router = Router();

// Template routes
checklistRouter.post('/template/:buildingId', createChecklistTemplateController);

checklistRouter.get('/templates/:buildingId', getChecklistsTemplatesController);

// Checklist routes
checklistRouter.get('/:checklistId', getChecklistsController);
checklistRouter.get('/v2/:buildingId', getChecklistsByBuildingIdController);

checklistRouter.post('/', createChecklistController);

checklistRouter.put('/:checklistId', updateChecklistController);
checklistRouter.put('/', updateChecklistController);

checklistRouter.delete('/:checklistId/:mode', deleteChecklistController);

// Esse report é do relatório
checklistRouter.get('/reports', findChecklistReportController);
checklistRouter.get('/:checklistId', findChecklistByIdController);
checklistRouter.get('/:buildingNanoId/:date', findManyChecklistsController);
checklistRouter.get('/:buildingNanoId/calendar/dates', findChecklistDataByMonthController);

// Esse report é do relato
checklistRouter.put('/reports', updateChecklistReportController);
checklistRouter.put('/', updateChecklistController);
