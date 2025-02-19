import { Response, Request } from 'express';

import { getChecklists } from '../services/getChecklists';

import { checkValues } from '../../../../utils/newValidator';

export async function getChecklistsController(req: Request, res: Response) {
  const { buildingId, checklistId } = req.params;

  checkValues([
    { label: 'ID da edificação', type: 'string', value: buildingId },
    { label: 'ID do checklist', type: 'string', value: checklistId },
  ]);

  const checklists = await getChecklists({ buildingId, checklistId });

  return res.status(201).json(checklists);
}
