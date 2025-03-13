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
import { createChecklistTemplateController } from '../../shared/checklists/controllers/createChecklistTemplateController';
import { getChecklistsTemplatesController } from '../../shared/checklists/controllers/getChecklistsTemplatesController';
import { createChecklistController2 } from '../../shared/checklists/controllers/createChecklistController2';
import { getChecklistsController } from '../../shared/checklists/controllers/getChecklistsController';
import { deleteChecklistController2 } from '../../shared/checklists/controllers/deleteChecklistController2';
import { getChecklistsByBuildingIdController } from '../../shared/checklists/controllers/getChecklistsByBuildingIdController';
import { updateChecklistController2 } from '../../shared/checklists/controllers/updateChecklistController2';
import { deleteChecklistTemplateController } from '../../shared/checklists/controllers/deleteChecklistTemplateController';

export const checklistRouter: Router = Router();

// Template routes
checklistRouter.post('/template/:buildingId', createChecklistTemplateController);
checklistRouter.delete('/template/:checklistTemplateId', deleteChecklistTemplateController);

checklistRouter.get('/templates/:buildingId', getChecklistsTemplatesController);

// Checklist routes
checklistRouter.get('/v2/:checklistId', getChecklistsController);
checklistRouter.get('/v2/:buildingId', getChecklistsByBuildingIdController);

checklistRouter.post('/v2', createChecklistController2);

checklistRouter.post('/', createChecklistController);

checklistRouter.put('/v2/:checklistId', updateChecklistController2);
checklistRouter.delete('/v2/:checklistId/:mode', deleteChecklistController2);

// Esse report é do relatório
checklistRouter.get('/reports', findChecklistReportController);
checklistRouter.get('/:checklistId', findChecklistByIdController);
checklistRouter.get('/:buildingNanoId/:date', findManyChecklistsController);
checklistRouter.get('/:buildingNanoId/calendar/dates', findChecklistDataByMonthController);

checklistRouter.delete('/:checklistId/:mode', deleteChecklistController);

checklistRouter.put('/complete', completeChecklistController);

// Esse report é do relato
checklistRouter.put('/reports', updateChecklistReportController);
checklistRouter.put('/', updateChecklistController);
