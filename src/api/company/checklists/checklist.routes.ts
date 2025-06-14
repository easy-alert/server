import { Router } from 'express';

import { findManyChecklistsController } from '../../shared/checklists/controllers/findManyChecklistsController';
import { findChecklistDataByMonthController } from '../../shared/checklists/controllers/findChecklistDataByMonthController';
// import { findChecklistByIdController } from '../../shared/checklists/controllers/findChecklistByIdController';
import { updateChecklistReportController } from '../../shared/checklists/controllers/updateChecklistReportController';
import { updateChecklistController } from '../../shared/checklists/controllers/updateChecklistController';
import { findChecklistReportController } from '../../shared/checklists/controllers/findChecklistReportController';
import { createChecklistTemplateController } from '../../shared/checklists/controllers/createChecklistTemplateController';
import { getChecklistsTemplatesController } from '../../shared/checklists/controllers/getChecklistsTemplatesController';
import { createChecklistController } from '../../shared/checklists/controllers/createChecklistController';
import { getChecklistsController } from '../../shared/checklists/controllers/getChecklistsController';
import { deleteChecklistController } from '../../shared/checklists/controllers/deleteChecklistController';
import { getChecklistsByBuildingIdController } from '../../shared/checklists/controllers/getChecklistsByBuildingIdController';
import { deleteChecklistTemplateController } from '../../shared/checklists/controllers/deleteChecklistTemplateController';
import { listChecklistReportsByCompanyIdController } from '../reports/controllers/listChecklistReportsByCompanyIdController';
import { generateChecklistReportPDFController } from '../reports/controllers/generateChecklistReportPDFController';
import { updateChecklistTemplateController } from '../../shared/checklists/controllers/updateChecklistTemplateController';

export const checklistRouter: Router = Router();

// Template routes
checklistRouter.post('/template/:buildingId', createChecklistTemplateController);
checklistRouter.delete('/template/:checklistTemplateId', deleteChecklistTemplateController);
checklistRouter.put('/template/:checklistTemplateId', updateChecklistTemplateController);

checklistRouter.get('/templates/list', getChecklistsTemplatesController);

// Checklist routes
checklistRouter.get('/:checklistId', getChecklistsController);
checklistRouter.get('/v2/:buildingId', getChecklistsByBuildingIdController);
checklistRouter.get('/list/:buildingNanoId/:date', findManyChecklistsController);
checklistRouter.get('/calendar/:buildingNanoId/dates', findChecklistDataByMonthController);

checklistRouter.post('/', createChecklistController);

checklistRouter.put('/:checklistId', updateChecklistController);

checklistRouter.delete('/:checklistId/:mode', deleteChecklistController);

// Esse report é do relatório
checklistRouter.get('/report/pdf', listChecklistReportsByCompanyIdController);
checklistRouter.post('/report/pdf', generateChecklistReportPDFController);

checklistRouter.get('/reports', findChecklistReportController);
// checklistRouter.get('/:checklistId', findChecklistByIdController);

// Esse report é do relato
checklistRouter.put('/reports', updateChecklistReportController);
